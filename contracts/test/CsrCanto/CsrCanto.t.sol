pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {Turnstile} from "../../contracts/mocks/canto/Turnstile.sol";
import {CsrCanto} from "../../contracts/CsrCanto/CsrCanto.sol";

contract CsrCantoTest is Test {
    Turnstile turnstile = new Turnstile(); // Deploy Canto chain Turnstile mock
    CsrCanto csrCanto;
    address god = makeAddr("god");
    address admin = makeAddr("admin");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        vm.prank(admin, admin);
        csrCanto = new CsrCanto(address(turnstile)); // Deploy CsrCanto.sol;
    }

    function test_name() public {
        assertEq(csrCanto.name(), "csrCANTO");
    }

    function test_symbol() public {
        assertEq(csrCanto.symbol(), "csrCANTO");
    }

    function test_addClaimer() public eqBalances {
        assertEq(csrCanto.isClaimer(alice), false);
        vm.prank(admin, admin);
        csrCanto.addClaimer(alice, alice);
        assertEq(csrCanto.isClaimer(alice), true);
        (address payee, , ) = csrCanto.holders(alice);
        assertEq(payee, alice);
    }

    function test_addClaimer_with_different_payee() public eqBalances {
        vm.prank(admin, admin);
        csrCanto.addClaimer(alice, bob);
        assertEq(csrCanto.isClaimer(alice), true);
        (address payee, , ) = csrCanto.holders(alice);
        assertEq(payee, bob);
    }

    function test_withdrawClaimed() public eqBalances {
        vm.prank(admin, admin);
        csrCanto.addClaimer(alice, bob);
        hoax(alice);
        csrCanto.deposit{value: 50}();
        hoax(god);
        turnstile.distributeFees{value: 100}(csrCanto.turnstileTokenId());
        csrCanto.pullFundsFromTurnstile();
        assertEq(address(csrCanto).balance, 150);
        assertEq(csrCanto.availableFunds(alice), 100); // alice has 100 in reward
        hoax(bob, 1000); // bob has 1000 CANTO
        csrCanto.withdrawClaimed(); // bob withdraw the rewards (from alice)
        assertEq(address(bob).balance, 1100); // bob has now 1100 CANTO
        assertEq(csrCanto.availableFunds(alice), 0);
    }

    modifier eqBalances() {
        _;
        assertEq(address(csrCanto).balance, csrCanto.totalSupply());
    }
}
