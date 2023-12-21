pragma solidity 0.8.17;

// Assuming the necessary imports are at the top
import "forge-std/Test.sol";
import "../../contracts/mocks/ERC20Mock.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../contracts/StakeManager/StakeManager.sol";

// Mock contract for simulating interaction from a whitelisted contract
contract MockWhitelistedContract {
    StakeManager public stakeManager;

    constructor(StakeManager _stakeManager) {
        stakeManager = _stakeManager;
    }

    function setUserStaking(address adr, uint256 balance) public {
        stakeManager.setUserStaking(adr, balance);
    }
}

contract StakeManagerTest is Test {
    StakeManager stakeManager;
    MockWhitelistedContract mockWhitelisted;
    ERC20Mock mockToken;

    function setUp() public {
        mockToken = new ERC20Mock("mockToken", "MTOKEN"); // Assuming ERC20Mock has mint function
        stakeManager = new StakeManager(address(mockToken));
        mockWhitelisted = new MockWhitelistedContract(stakeManager);

        // Whitelist our mock contract
        address[] memory contracts = new address[](1);
        contracts[0] = address(mockWhitelisted);
        stakeManager.setWhiteListedContracts(contracts);
        mockToken.mint(address(this), 50 ether);
        mockToken.transfer(address(stakeManager), 50 ether);
    }

    function test_WhitelistingContracts() public {
        address[] memory whitelisted = stakeManager.getWhitelistedContracts();
        assertEq(whitelisted[0], address(mockWhitelisted));

        // Test only owner can set whitelisted contracts
        bool reverted = false;
        vm.prank(makeAddr("vitalik"));
        try stakeManager.setWhiteListedContracts(whitelisted) {} catch {
            reverted = true;
        }
        assertEq(reverted, true);
    }

    function test_SetAndGetUserStake() public {
        address testUser = address(0x1234);
        mockWhitelisted.setUserStaking(testUser, 500 ether);

        uint256 userStake = stakeManager.getUserStake(testUser);
        assertEq(userStake, 500 ether);
        assertEq(userStake > 0, true);
    }

    function test_PenaltyCalculation_EdgeCases() public {
        uint256 stakeAmount = 1000 ether;

        // When stake duration is 0
        uint256 penalty = stakeManager.calculatePenaltyAmount(
            0,
            stakeAmount,
            true
        );
        uint256 expectedPenalty = (stakeAmount * stakeManager.initialFee()) /
            100;
        assertEq(penalty, expectedPenalty);

        // When stake duration is exactly the unstaking period for LP
        penalty = stakeManager.calculatePenaltyAmount(
            stakeManager.unstakingPeriodLP(),
            stakeAmount,
            true
        );
        assertEq(penalty, 0);
    }

    function test_Modifiers() public {
        bool reverted = false;
        try stakeManager.setTotalSupply(500) {} catch {
            reverted = true;
        }
        assertEq(reverted, true);
    }

    function test_StakeManagerContractCantCallTransferFunction() public {
        bool reverted = false;
        try
            stakeManager.transfer(address(this), address(this), 1 ether)
        {} catch {
            reverted = true;
        }
        assertEq(reverted, true);
    }

    function test_DeployStakingCSCRewardsContract() public {
        vm.warp(31 days);
        address stakingRewards = stakeManager.deployStakingContract();
        assertEq(mockToken.balanceOf(address(this)), 50 ether);
        assertEq(stakingRewards, stakeManager.getWhitelistedContracts()[1]);
    }
}
