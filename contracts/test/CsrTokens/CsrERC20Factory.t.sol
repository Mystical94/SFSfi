pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Turnstile} from "../../contracts/mocks/canto/Turnstile.sol";
import {CsrCanto} from "../../contracts/CsrCanto/CsrCanto.sol";
import {CsrERC20} from "../../contracts/csrTokens/CsrERC20.sol";
import {CsrERC20Factory} from "../../contracts/csrTokens/CsrERC20Factory.sol";

contract CsrERC20FactoryTest is Test {
    /* contracts */
    ERC20 $MCK = new ERC20("Mock", "MCK");
    Turnstile turnstile = new Turnstile(); // Deploy Canto chain Turnstile mock
    CsrCanto csrCanto = new CsrCanto(address(turnstile)); // Deploy CsrCanto.sol;
    CsrERC20Factory CEF;

    /* users */
    address god = makeAddr("god");
    address owner = makeAddr("owner");
    address cron = makeAddr("cron");
    address admin = makeAddr("admin");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address cscStakers = makeAddr("cscStakers");

    function setUp() public {
        startHoax(owner, owner);
        // Deploy CsrERC20Factory.sol
        CEF = new CsrERC20Factory(
            address(turnstile),
            address(csrCanto),
            address(cscStakers)
        );

        assertEq(CEF.cron(), address(owner));
        CEF.setCron(cron);
    }

    /// @notice Test that CsrERC20Factory gets assigned to the same Canto NFT id as the
    ///         contract address given as the first argument to the Turnstile contract
    ///         address given as the second argument
    function test_IsAssignedToCsrCantoNFTid() public {
        assertEq(
            turnstile.getTokenId(address(csrCanto)),
            turnstile.getTokenId(address(CEF))
        );
    }

    function test_isCsrERC20() public {
        address $csrMCK = CEF.create(payable(address($MCK)));
        assertEq(CEF.isCsrERC20(address($csrMCK)), true);
        assertEq(CEF.isCsrERC20(address($MCK)), false);
    }

    function test_getERC20() public {
        address $csrMCK = CEF.create(payable(address($MCK)));
        assertEq(CEF.getERC20(address($csrMCK)), address($MCK));
        assertEq(CEF.getERC20(address($MCK)), address(0));
    }

    /// @notice Test that CsrERC20Factory creates a CSR enabled wrapped token from an ERC20 contract address
    /// @dev Deploy a CSR enabled wrapped token from an ERC20 contract through CsrERC20Factory.sol
    function test_CreatesCsrERC20() public {
        address $csrMCK = CEF.create(payable(address($MCK)));
        assertEq(CsrERC20(payable($csrMCK)).name(), "CSR enabled Mock");
        assertEq(CsrERC20(payable($csrMCK)).symbol(), "csrMCK");
    }

    function test_ownership() public {
        vm.stopPrank();
        hoax(admin, 100);
        address $csrMCK = CEF.create(payable(address($MCK)));
        assertEq(CsrERC20(payable($csrMCK)).isClaimer(address(alice)), false);

        vm.startPrank(owner);
        CEF.addClaimer(address(alice), address(alice), address($csrMCK));
        assertEq(CsrERC20(payable($csrMCK)).isClaimer(address(alice)), true);

        CEF.delClaimer(address(alice), address($csrMCK));
        assertEq(CsrERC20(payable($csrMCK)).isClaimer(address(alice)), false);

        CEF.setAdmin(address(alice), address($csrMCK));
        assertEq(CsrERC20(payable($csrMCK)).ADMIN(), address(alice));

        vm.expectRevert();
        CEF.setAdmin(address(admin), address($csrMCK));

        vm.stopPrank();
        hoax(alice);
        CsrERC20(payable($csrMCK)).setAdmin(address(admin));
    }

    function test_transferOwnership() public {
        vm.stopPrank();
        hoax(admin, admin);
        address $csrMCK = CEF.create(payable(address($MCK)));

        vm.expectRevert("Ownable: caller is not the owner");
        CEF.addClaimer(address(alice), address(alice), address($csrMCK));

        vm.startPrank(owner, owner);
        CEF.addClaimer(address(alice), address(alice), address($csrMCK));
        CEF.transferOwnership(address(bob));
        vm.expectRevert("Ownable: caller is not the owner");
        CEF.delClaimer(address(alice), address($csrMCK));
        vm.stopPrank();
        hoax(bob, bob);
        CEF.delClaimer(address(alice), address($csrMCK));
    }

    function test_setCron() public {
        assertEq(CEF.cron(), address(cron));
        vm.stopPrank();
        hoax(owner);
        CEF.setCron(address(alice));
        assertEq(CEF.cron(), address(alice));
    }

    /// @notice Test that only the cron address can pull funds from the turnstile
    ///         for any CsrERC20 contract
    function test_pullFundsFromTurnstile() public {
        vm.stopPrank();
        hoax(admin, admin);
        address $csrMCK = CEF.create(payable(address($MCK)));
        /* alice wrap 1000 MCK to csrMCK */
        deal(address($MCK), alice, 1000);
        vm.startPrank(alice);
        $MCK.approve($csrMCK, 1000);
        CsrERC20(payable($csrMCK)).deposit(1000);
        /* turnstile distribute 100 CANTO */

        vm.stopPrank();
        hoax(god, god);
        turnstile.distributeFees{value: 100}(
            CsrERC20(payable($csrMCK)).turnstileTokenId()
        );

        vm.expectRevert("CsrERC20Factory: only cron");
        CEF.pullFundsFromTurnstile($csrMCK);

        vm.prank(cron);
        CEF.pullFundsFromTurnstile($csrMCK);

        turnstile.distributeFees{value: 100}(
            CsrERC20(payable($csrMCK)).turnstileTokenId()
        );

        hoax(owner, owner);
        CEF.setCron(address(bob));

        hoax(bob, bob);
        CEF.pullFundsFromTurnstile($csrMCK);
    }

    function test_set_and_get_cscStakers() public {
        assertEq(CEF.csc_stakers(), address(cscStakers));
        vm.stopPrank();
        hoax(owner);
        CEF.setCscStakers(address(alice));
        assertEq(CEF.csc_stakers(), address(alice));
    }

    function test_getTokensCount_and_getTokenById() public {
        ERC20 $MCK2 = new ERC20("Mock2", "MCK2");

        assertEq(CEF.getTokenPairsCount(), 0);
        CEF.create(payable(address($MCK)));
        assertEq(CEF.getTokenPairsCount(), 1);
        CEF.create(payable(address($MCK2)));
        assertEq(CEF.getTokenPairsCount(), 2);

        (address erc20, ) = CEF.getTokenPairById(0);
        assertEq(erc20, address($MCK));
        (erc20, ) = CEF.getTokenPairById(1);
        assertEq(erc20, address($MCK2));
    }
}
