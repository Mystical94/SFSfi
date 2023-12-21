pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "../../contracts/CSC/Auction.sol";
import "../../contracts/CSC/CSC.sol";
import "../../contracts/mocks/ERC20Mock.sol";
import "../../contracts/external/Turnstile.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "forge-std/console.sol";

contract AuctionTest is Test {
    Auction auction;
    CSC csc;
    ERC20Mock mockNOTE;
    Turnstile turnstile;

    function setUp() public {
        mockNOTE = new ERC20Mock("mockNote", "MNOTE");
        csc = new CSC("CSC", "$CSC", address(this), 750_000 ether);
        turnstile = new Turnstile();
        uint256 nftId = turnstile.register(address(this));
        auction = new Auction(
            IERC20(csc),
            IERC20(mockNOTE),
            block.timestamp + 10,
            block.timestamp + 86400 * 30 + 10,
            address(this),
            address(turnstile),
            nftId
        );
        csc.transfer(address(auction), 750_000 ether);
    }

    function test_SaleHasNotStarted() public {
        assertEq(auction.hasStarted(), false);
    }

    function test_SaleHasStarted() public {
        vm.warp(block.timestamp + 20);
        assertEq(auction.hasStarted(), true);
    }

    function test_CorrectEndTimeIsSet() public {
        assertEq(auction.getRemainingTime(), block.timestamp + 86400 * 30 + 9);
    }

    function test_SaleHasNotEnded() public {
        assertEq(auction.hasEnded(), false);
    }

    function test_SaleHasEnded() public {
        vm.warp(block.timestamp + 86400 * 30 + 10);
        assertEq(auction.hasEnded(), true);
    }

    function test_PriceIsFiveCents() public {
        assertEq(auction.price(), 50000000000000000);
    }

    function test_PriceIsFiveMoreThanCents() public {
        mockNOTE.mint(address(this), 37_501 ether);
        vm.warp(block.timestamp + 10);
        mockNOTE.approve(address(auction), 37_501 ether);
        auction.buy(37_501 ether);
        assertEq(auction.price(), 50001333333333333);
    }

    function test_CalculatesTheCorrectedExpectedClaimAmount() public {
        mockNOTE.mint(address(this), 10_000 ether);
        vm.warp(block.timestamp + 10);
        mockNOTE.approve(address(auction), 37_501 ether);
        auction.buy(10_000 ether);
        assertEq(auction.getExpectedClaimAmount(address(this)), 500 ether);
    }

    function test_BuyIncreasesAllocations() public {
        mockNOTE.mint(address(this), 10_000 ether);
        vm.warp(block.timestamp + 10);
        mockNOTE.approve(address(auction), 37_501 ether);
        auction.buy(10_000 ether);
        (uint256 allocation, uint256 contribution, bool hasClaimed) = auction
            .userInfo(address(this));
        assertEq(auction.totalAllocation(), 10_000 ether);
        assertEq(auction.totalRaised(), 10_000 ether);
        assertEq(allocation, 10_000 ether);
        assertEq(contribution, 10_000 ether);
        assertEq(hasClaimed, false);
    }
}
