pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {ERC20Mock} from "../../contracts/mocks/ERC20Mock.sol";
import {Turnstile} from "../../contracts/mocks/canto/Turnstile.sol";
import {CsrCanto} from "../../contracts/CsrCanto/CsrCanto.sol";
import {CsrERC20} from "../../contracts/csrTokens/CsrERC20.sol";
import {CsrERC20Factory} from "../../contracts/csrTokens/CsrERC20Factory.sol";

/// @title CsrERC20 test
/// @author Bob
/// @notice Create a csrERC20 using CsrERC20Factory and CsrERC20implementation.
///         Test that the csrERC20 created behaves as expected.
contract CsrERC20Test is Test {
    /* contracts */
    ERC20Mock $MCK;
    Turnstile turnstile = new Turnstile(); // Deploy Canto chain Turnstile mock
    CsrCanto csrCanto = new CsrCanto(address(turnstile)); // Deploy CsrCanto.sol;
    CsrERC20Factory CEF;
    address $csrMCK;

    /* users */
    address god = makeAddr("god");
    address owner = makeAddr("owner");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address cscStakers = makeAddr("cscStakers");

    function setUp() public prankCall(owner) {
        CEF = new CsrERC20Factory( // Deploy CsrERC20Factory.sol
            address(turnstile),
            address(csrCanto),
            address(cscStakers)
        );
        $MCK = new ERC20Mock("Mock", "MCK"); // Deploy an ERC20;
        deal(address($MCK), alice, 200);
        $csrMCK = CEF.create(payable(address($MCK)));
    }

    /// @notice Test that CsrERC20Factory creates a CSR enabled wrapped token from an ERC20 contract address
    /// @dev Deploy a CSR enabled wrapped token from an ERC20 contract through CsrERC20Factory.sol
    function test_CreatesCsrERC20() public eqBalances {
        assertEq(CsrERC20(payable($csrMCK)).name(), "CSR enabled Mock");
        assertEq(CsrERC20(payable($csrMCK)).symbol(), "csrMCK");
    }

    function test_wrapAndUnwrap() public prankCall(alice) eqBalances {
        /* wrap 50 (wei) MCK -> csrMCK */
        ERC20Mock($MCK).approve(address($csrMCK), 50);
        bool success = CsrERC20(payable($csrMCK)).deposit(50);
        assertTrue(success);
        assertEq(ERC20Mock($MCK).balanceOf(address(alice)), 150);
        assertEq(CsrERC20(payable($csrMCK)).balanceOf(address(alice)), 50);
        assertEq( // $MCK balance and $csrMCK must be equal at any time
            ERC20Mock($MCK).balanceOf(address($csrMCK)),
            CsrERC20(payable($csrMCK)).totalSupply()
        );

        /* unwrap 20 (wei) csrMCK -> MCK */
        CsrERC20(payable($csrMCK)).withdraw(20);
        assertEq(ERC20Mock($MCK).balanceOf(address(alice)), 170);
        assertEq(CsrERC20(payable($csrMCK)).balanceOf(address(alice)), 30);
        assertEq( // $MCK balance and $csrMCK must be equal at any time
            ERC20Mock($MCK).balanceOf(address($csrMCK)),
            CsrERC20(payable($csrMCK)).totalSupply()
        );

        /* unwrap too much csrMCK -> MCK */
        vm.expectRevert("ERC20: burn amount exceeds balance");
        CsrERC20(payable($csrMCK)).withdraw(31);
    }

    function test_can_receive_CANTO_only_from_turnstile() public eqBalances {
        hoax(alice, 10);
        (bool ok, ) = payable($csrMCK).call{value: 1}("");
        assertFalse(ok);

        hoax(address(turnstile), 10);
        (ok, ) = payable($csrMCK).call{value: 1}("");
        assertTrue(ok);
    }

    function test_only_EOA_can_register() public eqBalances {
        vm.prank(alice);
        vm.expectRevert("Registrant must be an EOA");
        CsrERC20(payable($csrMCK)).register();
    }

    function test_claimersTotalSupply() public eqBalances {
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 0);
        equalBalances();

        /* [0xAlice] wrap 100 (wei) MCK -> csrMCK */
        vm.prank(alice);
        ERC20Mock($MCK).approve(address($csrMCK), 100);
        vm.prank(alice);
        CsrERC20(payable($csrMCK)).deposit(100);
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 0);
        equalBalances();

        /* [0xAlice] register as a claimer */
        vm.prank(alice, alice);
        CsrERC20(payable($csrMCK)).register();
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 100);
        equalBalances();

        /* [0xAlice] unwrap 25 (wei) csrMCK -> MCK */
        vm.prank(alice);
        CsrERC20(payable($csrMCK)).withdraw(25);
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 75);
        equalBalances();

        /* [0xAlice] send 25 (wei) csrMCK to 0xBob */
        vm.prank(alice);
        CsrERC20(payable($csrMCK)).transfer(address(bob), 25);
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 50);
        equalBalances();

        /* [0xBob] register as a claimer */
        vm.prank(bob, bob);
        CsrERC20(payable($csrMCK)).register();
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 75);
        equalBalances();

        /* [0xOwner] remove 0xAlice eligibility to claim */
        vm.prank(owner);
        CEF.delClaimer(address(alice), payable($csrMCK));
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 25);
        equalBalances();

        /* [0xOwner] remove 0xBob eligibility to claim */
        vm.prank(owner);
        CEF.delClaimer(address(bob), payable($csrMCK));
        assertEq(CsrERC20(payable($csrMCK)).claimersTotalSupply(), 0);
    }

    function test_withdrawClaimed_tax() public eqBalances {
        vm.prank(owner, owner);
        deal(address($MCK), alice, 50);

        vm.prank(owner, owner);
        CEF.addClaimer(alice, bob, $csrMCK);

        vm.prank(alice);
        $MCK.approve($csrMCK, 50);
        vm.prank(alice, alice);
        CsrERC20(payable($csrMCK)).deposit(50);

        hoax(god);
        turnstile.distributeFees{value: 100}(
            CsrERC20(payable($csrMCK)).turnstileTokenId()
        );
        CsrERC20(payable($csrMCK)).pullFundsFromTurnstile();
        assertEq(address(CsrERC20(payable($csrMCK))).balance, 100);
        assertEq(CsrERC20(payable($csrMCK)).availableFunds(alice), 100); // alice has 100 in reward

        startHoax(bob, 1000); // bob has 1000 CANTO
        CsrERC20(payable($csrMCK)).withdrawClaimed(); // bob withdraw the rewards (from alice)
        assertEq(bob.balance, 1090); // bob has now 1000 + 90 CANTO
        assertEq(cscStakers.balance, 10); // cscStakers has 10 CANTO (10% tax)
        assertEq(alice.balance, 0); // alice is not the payee
    }

    function equalBalances() public {
        assertEq( // $MCK balance and $csrMCK must be equal at any time
            ERC20Mock($MCK).balanceOf(address($csrMCK)),
            CsrERC20(payable($csrMCK)).totalSupply()
        );
    }

    modifier eqBalances() {
        _;
        assertEq( // $MCK balance and $csrMCK must be equal at any time
            ERC20Mock($MCK).balanceOf(address($csrMCK)),
            CsrERC20(payable($csrMCK)).totalSupply()
        );
    }

    modifier prankCall(address pranker) {
        vm.startPrank(pranker, pranker);
        _;
        vm.stopPrank();
    }
}
