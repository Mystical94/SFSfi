pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../../contracts/CSC/CSC.sol";
import "../../contracts/CSC/StakingCSCRewards.sol";
import "../../contracts/StakeManager/StakeManager.sol";
import "../../contracts/mocks/ERC20Mock.sol";

contract StakingCSCRewardsTest is Test {
    CSC csc;
    StakingCSCRewards sr;
    StakeManager sm;
    address[] srAddresses;

    address alice = makeAddr("alice");

    address vitalik = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;
    address[] stakers = [
        0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
        0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
        0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
        0x90F79bf6EB2c4f870365E785982E1f101E93b906,
        0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
        0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
        0x976EA74026E726554dB657fA54763abd0C3a0aa9,
        0x14dC79964da2C08b23698B3D3cc7Ca32193d9955,
        0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f,
        0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
    ];

    uint256[] rewards = [
        500_000 ether,
        375_000 ether,
        281_250 ether,
        210_938 ether,
        158_203 ether,
        118_652 ether,
        88989 ether,
        66742 ether,
        50056 ether,
        37542 ether,
        28157 ether,
        21118 ether,
        15838 ether,
        11879 ether,
        8909 ether,
        6682 ether,
        5011 ether,
        3758 ether,
        2819 ether,
        2114 ether,
        1586 ether,
        1189 ether,
        892 ether,
        669 ether,
        502 ether,
        376 ether,
        282 ether,
        212 ether,
        159 ether,
        119 ether,
        89 ether,
        67 ether,
        50 ether,
        38 ether,
        28 ether,
        21 ether,
        16 ether,
        12 ether,
        9 ether,
        7 ether,
        5 ether,
        4 ether,
        3 ether,
        2 ether,
        2 ether,
        1 ether,
        1 ether
    ];

    event Recovered(address, uint);
    event Transfer(address indexed from, address indexed to, uint256 reward);
    event RewardPaid(address, uint256);

    function setUp() public {
        csc = new CSC("CSC", "$CSC", address(this), 2_000_488 ether);
        sm = new StakeManager(address(csc));
        sr = new StakingCSCRewards(address(this), address(csc), address(sm));
        srAddresses.push(address(sr));
        sm.setWhiteListedContracts(srAddresses);
    }

    function test_ConstructorSetsRewardsAndStakingToken() public {
        assertEq(address(sr.rewardsAndStakingToken()), address(csc));
    }

    function test_ConstructorSetsOwner() public {
        assertEq(sr.owner(), address(this));
    }

    function test_TotalSupplyIsNotZero() public {
        assertEq(sr.totalSupply(), 0 ether);
    }

    function test_OnlyOwnerCanCallNotifyRewardAmountRevert() public {
        vm.prank(address(csc));
        vm.expectRevert("Ownable: caller is not the owner");
        sr.notifyRewardAmount(500_000 ether);
    }

    function test_OnlyOwnerCanCallSetRewardsDuration() public {
        sr.setRewardsDuration(10 days);
        assertEq(sr.rewardsDuration(), 10 days);
    }

    function test_OnlyOwnerCanCallSetRewardsDurationRevert() public {
        vm.prank(address(csc));
        vm.expectRevert("Ownable: caller is not the owner");
        sr.setRewardsDuration(10 days);
    }

    function test_OnlyOwnerCanPauseContractRevert() public {
        vm.prank(address(csc));
        vm.expectRevert("Ownable: caller is not the owner");
        sr.pauseContract();
    }

    function test_OnlyOwnerCanUnPauseContractRevert() public {
        vm.prank(address(csc));
        vm.expectRevert("Ownable: caller is not the owner");
        sr.unpauseContract();
    }

    function test_OnlyOwnerCanPauseContract() public {
        sr.pauseContract();
        assertEq(sr.paused(), true);
    }

    function test_OnlyOwnerCanUnPauseContract() public {
        sr.pauseContract();
        sr.unpauseContract();
        assertEq(sr.paused(), false);
    }

    function test_OnlyOwnerCanRecoverERC20Tokens() public {
        csc.transfer(address(sr), 500_001 ether);
        vm.expectEmit(true, true, false, true);
        emit Recovered(address(csc), 500_001 ether);
        sr.recoverERC20(address(csc), 500_001 ether);
    }

    function test_OnlyOwnerCanRecoverERC20TokensRevert() public {
        vm.prank(address(csc));
        vm.expectRevert("Ownable: caller is not the owner");
        sr.recoverERC20(address(csc), 10 ether);
    }

    function test_LastTimeRewardApplicableShouldReturnZero() public {
        assertEq(sr.lastTimeRewardApplicable(), 0);
    }

    function test_WhenUserStakesTotalSupplyShouldIncrease() public {
        csc.approve(address(sr), 99 ether);
        sr.stake(99 ether);
        assertEq(sr.totalSupply(), 99 ether);
    }

    function test_WhenRewardsAreUpdatedLastTimeRewardApplicableShouldEqualCurrentTime()
        public
    {
        vm.warp(1 days);
        csc.transfer(address(sr), 500_000 ether);
        sr.setRewardsDuration(30 days);
        sr.notifyRewardAmount(500_000 ether);
        assertEq(sr.lastTimeRewardApplicable(), 1 days);
    }

    function test_RewardPerTokenShouldReturnZeroWhenNoRewardsAreSet() public {
        assertEq(sr.rewardPerToken(), 0);
    }

    function test_RewardsPerTokenShouldInreaseAfterADay() public {
        csc.transfer(address(sr), 500_000 ether);
        sr.notifyRewardAmount(500_000 ether);
        csc.approve(address(sr), 99 ether);
        sr.stake(99 ether);
        vm.warp(block.timestamp + 1 days);
        assertEq(sr.rewardPerToken() > 0, true);
    }

    function test_EarnedShouldReturnZeroWhenNotStaked() public {
        assertEq(sr.earned(address(this)), 0);
    }

    function test_EarnedShouldReturnAboveZeroWhenStaked() public {
        csc.transfer(address(sr), 500_000 ether);
        sr.notifyRewardAmount(500_000 ether);
        csc.approve(address(sr), 99 ether);
        sr.stake(1 ether);
        vm.warp(1 days);
        assertEq(
            sr.earned(address(this)) > 16_600 ether &&
                sr.earned(address(this)) < 17_000 ether,
            true
        );
    }

    function test_WithdrawDoesNotReturnAllStakeCollateral() public {
        csc.transfer(alice, 1 ether);
        vm.startPrank(alice);
        csc.approve(address(sr), 1 ether);
        sr.stake(1 ether);
        vm.warp(1 days + 1);
        sr.withdraw();
        assertEq(csc.balanceOf(alice) != 1 ether, true);
        vm.stopPrank();
    }

    function test_AllMonthsSingleStakerStakingReward() public {
        sr = new StakingCSCRewards(address(this), address(csc), address(sm));
        csc.transfer(address(sr), rewards[0]);
        csc.transfer(alice, 1 ether);
        srAddresses.push(address(sr));
        sm.setWhiteListedContracts(srAddresses);
        sr.setRewardsDuration(30 days);
        sr.notifyRewardAmount(rewards[0]);
        vm.startPrank(alice);
        csc.approve(address(sr), 1 ether);
        sr.stake(1 ether);
        vm.warp(block.timestamp + 1 days * 30 + 2);
        assertEq(block.timestamp > sr.periodFinish(), true);
        vm.expectRevert("can only claim reward if unstaked");
        sr.getReward();
        sr.withdraw();
        vm.warp(block.timestamp + 1 days * 30 + 2);
        sr.getReward();
        uint256 aliceBalance = csc.balanceOf(alice);
        assertEq(
            aliceBalance < 500_002 ether && aliceBalance > 500_000 ether,
            true
        );
        vm.stopPrank();
    }

    function test_UserGetsSlashedWhenExitingAfterADay() public {
        csc.transfer(address(sr), 500_000 ether);
        csc.transfer(alice, 1 ether);
        sr.setRewardsDuration(30 days);
        sr.notifyRewardAmount(500_000 ether);
        vm.startPrank(alice);
        csc.approve(address(sr), 1 ether);
        sr.stake(1 ether);
        vm.warp(block.timestamp + 30 days + 1);
        sr.withdraw();
        sr.getReward();
        uint256 stakerBalance = csc.balanceOf(alice);
        uint256 burnedAmount = csc.balanceOf(address(1));
        assertEq(
            (stakerBalance < 250_001 ether && stakerBalance > 250_000 ether),
            true
        );
        assertEq(
            (burnedAmount < 250_001 ether && burnedAmount > 249_000 ether),
            true
        );
    }

    function test_OneMonthOfStakingWith10Stakers() public {
        sr = new StakingCSCRewards(address(this), address(csc), address(sm));
        csc.transfer(address(sr), rewards[0]);
        srAddresses.push(address(sr));
        sm.setWhiteListedContracts(srAddresses);
        sr.setRewardsDuration(30 days);
        sr.notifyRewardAmount(rewards[0]);

        uint256 countdown = stakers.length;
        while (countdown != 0) {
            address staker = stakers[countdown - 1];
            csc.transfer(staker, 1 ether);
            vm.prank(staker);
            csc.approve(address(sr), 1 ether);
            vm.prank(staker);
            sr.stake(1 ether);
            vm.expectRevert("can only claim reward if unstaked");
            vm.prank(staker);
            sr.getReward();
            countdown--;
        }

        uint256 countdown2 = stakers.length;
        vm.warp(block.timestamp + 1 days * 30 + 1);
        while (countdown2 != 0) {
            address staker = stakers[countdown2 - 1];
            vm.prank(staker);
            sr.withdraw();
            countdown2--;
        }

        uint256 countdown3 = stakers.length;
        vm.warp(block.timestamp + 1 days * 30 + 1);
        while (countdown3 != 0) {
            address staker = stakers[countdown3 - 1];
            vm.prank(staker);
            sr.getReward();
            countdown3--;
        }

        uint256 countdown4 = stakers.length;
        // No penalties
        assertEq(csc.balanceOf(address(1)), 0);
        vm.warp(block.timestamp + 100);
        while (countdown4 != 0) {
            address staker = stakers[countdown4 - 1];
            uint256 stakerBalance = csc.balanceOf(staker);
            assertEq(stakerBalance > 49_000 ether, true);
            assertEq(stakerBalance < 51_000 ether, true);
            countdown4--;
        }
    }

    function test_AllMonthsManyStakersStakingRewards() public {
        for (uint i = 0; i < rewards.length; i++) {
            sr = new StakingCSCRewards(
                address(this),
                address(csc),
                address(sm)
            );
            csc.transfer(address(sr), rewards[i]);
            srAddresses.push(address(sr));
            sm.setWhiteListedContracts(srAddresses);
            sr.setRewardsDuration(30 days);
            sr.notifyRewardAmount(rewards[i]);

            uint256 countdown = stakers.length;
            while (countdown != 0) {
                address staker = stakers[countdown - 1];
                csc.transfer(staker, 1 ether);
                vm.prank(staker);
                csc.approve(address(sr), 1 ether);
                vm.prank(staker);
                sr.stake(1 ether);
                vm.expectRevert("can only claim reward if unstaked");
                vm.prank(staker);
                sr.getReward();
                countdown--;
            }

            uint256 countdown2 = stakers.length;
            vm.warp(block.timestamp + 1 days * 30 + 1);
            while (countdown2 != 0) {
                address staker = stakers[countdown2 - 1];
                vm.prank(staker);
                sr.withdraw();
                countdown2--;
            }

            uint256 countdown3 = stakers.length;
            vm.warp(block.timestamp + 1 days * 30 + 1);
            while (countdown3 != 0) {
                address staker = stakers[countdown3 - 1];
                vm.prank(staker);
                sr.getReward();
                countdown3--;
            }
        }

        uint256 countdown4 = stakers.length;
        // No penalties
        assertEq(csc.balanceOf(address(1)), 0);

        while (countdown4 != 0) {
            address staker = stakers[countdown4 - 1];
            uint256 stakerBalance = csc.balanceOf(staker);
            assertEq(stakerBalance > 199_900 ether, true);
            assertEq(stakerBalance < 205_000 ether, true);
            countdown4--;
        }
    }

    function test_FlakyUser() public {
        sr = new StakingCSCRewards(address(this), address(csc), address(sm));
        csc.transfer(address(sr), rewards[0]);
        srAddresses.push(address(sr));
        sm.setWhiteListedContracts(srAddresses);
        sr.setRewardsDuration(30 days);
        sr.notifyRewardAmount(rewards[0]);
        address staker = stakers[0];
        csc.transfer(staker, 1 ether);
        vm.startPrank(staker);
        csc.approve(address(sr), 2 ether);
        sr.stake(1 ether);
        vm.warp(block.timestamp + 10 days);
        sr.withdraw();
        vm.warp(block.timestamp + 10 days);
        sr.getReward();
        vm.warp(block.timestamp + 1 days);
        sr.stake(1 ether);
        vm.warp(block.timestamp + 1 days);
        uint256 stakerReward = sr.earned(staker);
        console.logUint(stakerReward);
        vm.stopPrank();
    }

    function test_MultipleStakingWithoutWithdraw() public {
        csc.transfer(address(sr), 500_000 ether);
        sr.notifyRewardAmount(500_000 ether);
        csc.approve(address(sr), 3 ether);
        sr.stake(1 ether);
        vm.warp(10 days);
        sr.stake(1 ether);
        vm.warp(10 days);
        sr.stake(1 ether);
        uint256 earnedReward = sr.earned(address(this));
        assertEq(earnedReward > 10000 ether, true);
    }
}
