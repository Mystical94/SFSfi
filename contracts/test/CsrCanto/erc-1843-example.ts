import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { expect } from 'chai';
import { afterEachFn } from './utils';
import { main } from '../../scripts/deployAll';

describe('ERC-1843 example', function () {
  let net: any;
  let csrCanto: Contract;
  let turnstile: Contract;
  let turnstileTokenId: number;

  before(async function () {
    net = await main();
    const CsrCanto: ContractFactory = await ethers.getContractFactory('CsrCanto');
    const Turnstile: ContractFactory = await ethers.getContractFactory('contracts/mocks/canto/Turnstile.sol:Turnstile');
    csrCanto = CsrCanto.attach(net.contracts.csrCanto);
    turnstile = Turnstile.attach(net.contracts.turnstile);
    turnstileTokenId = await csrCanto.turnstileTokenId();

    await csrCanto.connect(net.signers.alice).register();
    await csrCanto.connect(net.signers.alice).deposit({ value: 100 });
  });
  this.afterEach(() => afterEachFn(csrCanto));

  describe('0. token creation', function () {
    it('Alice balance: 100\n            Bob balance: 0\n  Alice funds available: 0\n    Bob funds available: 0\n         funds received: 0\n', async function () {
      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(100);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(0);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(0);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(0);
      expect(await csrCanto.receivedFunds()).to.equal(0);
    });
  });
  describe('1. 20 Ether sent to the contract', function () {
    it('Alice balance: 100\n            Bob balance: 0\n  Alice funds available: 20\n    Bob funds available: 0\n         funds received: 20\n', async function () {
      await turnstile.connect(net.signers.god).distributeFees(turnstileTokenId, { value: 20 });
      await csrCanto.connect(net.signers.god).pullFundsFromTurnstile();

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(100);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(0);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(20);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(0);
      expect(await csrCanto.receivedFunds()).to.equal(20);
    });
  });

  describe('2. Alice has sent 25 tokens to Bob', function () {
    it('Alice balance: 75\n            Bob balance: 25\n  Alice funds available: 20\n    Bob funds available: 0\n         funds received: 20\n', async function () {
      await csrCanto.connect(net.signers.alice).transfer(net.signers.bob.address, 25);
      await csrCanto.connect(net.signers.bob).register();

      /////////////////////////
      //      DEBUGGING      //
      /////////////////////////
      // console.log("------------------");
      // console.log(`  claimersTotalSupply: ${await csrCanto.claimersTotalSupply()} (100)`);
      // console.log(`Alice claimed funds: ${(await csrCanto.holders(net.signers.alice.address)).claimedFunds} (0)`);
      // console.log(`Alice processed funds: ${(await csrCanto.holders(net.signers.alice.address)).processedFunds} (0)`);
      // console.log("---");
      // console.log(`        Alice balance: ${await csrCanto.balanceOf(net.signers.alice.address)} (75)`);
      // console.log(`          Bob balance: ${await csrCanto.balanceOf(net.signers.bob.address)} (25)`);
      // console.log(`Alice funds available: ${await csrCanto.availableFunds(net.signers.alice.address)} (20)`);
      // console.log(`  Bob funds available: ${await csrCanto.availableFunds(net.signers.bob.address)} (0)`);
      // console.log(`       funds received: ${await csrCanto.balanceOf(net.contracts.csrCanto)} (20)`);
      // console.log("------------------");
      /////////////////////////

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(75);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(25);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(20);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(0);
      expect(await csrCanto.receivedFunds()).to.equal(20);
    });
  });

  describe('3. 20 Ether sent to the contract', function () {
    it('Alice balance: 75\n            Bob balance: 25\n  Alice funds available: 35\n    Bob funds available: 5\n         funds received: 40\n', async function () {
      await turnstile.connect(net.signers.god).distributeFees(turnstileTokenId, { value: 20 });
      await csrCanto.connect(net.signers.god).pullFundsFromTurnstile();

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(75);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(25);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(35);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(5);
      expect(await csrCanto.receivedFunds()).to.equal(40);
    });
  });

  describe('4. Alice withdraws her claimed funds', function () {
    it('Alice balance: 75\n            Bob balance: 25\n  Alice funds available: 0\n    Bob funds available: 5\n         funds received: 40\n', async function () {
      await csrCanto.connect(net.signers.alice).withdrawClaimed();

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(75);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(25);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(0);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(5);
      expect(await csrCanto.receivedFunds()).to.equal(40);
    });
  });

  describe('5. 16 Ether sent to the contract', function () {
    it('Alice balance: 75\n            Bob balance: 25\n  Alice funds available: 12\n    Bob funds available: 9\n         funds received: 56\n', async function () {
      await turnstile.connect(net.signers.god).distributeFees(turnstileTokenId, { value: 16 });
      await csrCanto.connect(net.signers.god).pullFundsFromTurnstile();

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(75);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(25);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(12);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(9);
      expect(await csrCanto.receivedFunds()).to.equal(56);
    });
  });

  describe('6. Alice has sent 25 tokens to Bob', function () {
    it('Alice balance: 50\n            Bob balance: 50\n  Alice funds available: 12\n    Bob funds available: 9\n         funds received: 56\n', async function () {
      await csrCanto.connect(net.signers.alice).transfer(net.signers.bob.address, 25);

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(50);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(50);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(12);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(9);
      expect(await csrCanto.receivedFunds()).to.equal(56);
    });
  });

  describe('7. 8 Ether sent to the contract', function () {
    it('Alice balance: 50\n            Bob balance: 50\n  Alice funds available: 16\n    Bob funds available: 13\n         funds received: 64\n', async function () {
      await turnstile.connect(net.signers.god).distributeFees(turnstileTokenId, { value: 8 });
      await csrCanto.connect(net.signers.god).pullFundsFromTurnstile();

      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(50);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(50);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(16);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(13);
      expect(await csrCanto.receivedFunds()).to.equal(64);
    });
  });

  describe('8. Bob has sent 50 tokens to X', function () {
    it('Alice balance: 50\n            Bob balance: 0\n  Alice funds available: 16\n    Bob funds available: 13\n         funds received: 64\n', async function () {
      await csrCanto.connect(net.signers.carol).register();
      await csrCanto.connect(net.signers.bob).transfer(net.signers.carol.address, 50);
      
      expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(50);
      expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(0);
      expect(await csrCanto.availableFunds(net.signers.alice.address)).to.equal(16);
      expect(await csrCanto.availableFunds(net.signers.bob.address)).to.equal(13);
      expect(await csrCanto.receivedFunds()).to.equal(64);
    });
  });
});