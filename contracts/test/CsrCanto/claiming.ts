import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { expect } from 'chai';
import { afterEachFn } from './utils';
import { main } from '../../scripts/deployAll';

describe('claiming', async function () {
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

    await turnstile.connect(net.signers.god).distributeFees(turnstileTokenId, { value: 100 });
  });
  this.afterEach(() => afterEachFn(csrCanto));

  describe('security', async function () {
    it("shouldn't claim because claimersTotalSupply is 0", async function () {
      await csrCanto.connect(net.signers.alice).register();
      await expect(csrCanto.connect(net.signers.alice).withdrawClaimed()).to.be.revertedWith(
        'No claimers yet.'
      );
    });

    it("shouldn't claim because user is not in the payees list", async function () {
      await csrCanto.connect(net.signers.alice).deposit({ value: 100 });
      await expect(csrCanto.connect(net.signers.bob).withdrawClaimed()).to.be.revertedWith(
        'Not in the payees list.'
      );
    });
  });

  describe('claiming', async function () {
    it('should add a Bob as a claimer with Carol as the payee address', async function () {
      await csrCanto.connect(net.signers.admin).addClaimer(net.signers.bob.address, net.signers.carol.address);
      expect(await csrCanto.isClaimer(net.signers.bob.address)).to.equal(true);
    });
    
    it("should withdraw Bob's claimed funds to Carol payee address", async function () {
      await csrCanto.connect(net.signers.bob).deposit(({ value: 100 }));
      await csrCanto.connect(net.signers.god).pullFundsFromTurnstile();

      const availableFunds = await csrCanto.availableFunds(net.signers.bob.address);

      const balanceBefore = await net.signers.carol.getBalance();
      const tx = await csrCanto.connect(net.signers.carol).withdrawClaimed();
      const receipt = await tx.wait();
      const feeSpent = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);

      expect(await net.signers.carol.getBalance()).to.eq(balanceBefore.add(availableFunds).sub(feeSpent));
    });
  });
});
