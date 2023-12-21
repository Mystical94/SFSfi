import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { expect } from 'chai';
import { afterEachFn } from './utils';
import { main } from '../../scripts/deployAll';

describe('Admin role and admin only functions', function () {
  let net: any;
  let csrCanto: Contract;

  beforeEach(async function () {
    net = await main();
    const CsrCanto: ContractFactory = await ethers.getContractFactory('CsrCanto');
    csrCanto = CsrCanto.attach(net.contracts.csrCanto);
  });

  this.afterEach(() => afterEachFn(csrCanto));

  it('should set the ADMIN_ROLE correctly', async function () {
    await expect(csrCanto.connect(net.signers.admin).setAdmin(net.signers.alice.address))
      .to.be.fulfilled;
    expect(await csrCanto.ADMIN()).to.equal(net.signers.alice.address);
  });
  
  it('should revert if not admin set ADMIN', async function () {
    await expect(csrCanto.connect(net.signers.alice).setAdmin(net.signers.alice.address))
      .to.be.revertedWith("Only admin can set a new ADMIN address.");
  });

  it('should revert if not admin adds an address as a claimer', async function () {
    await expect(
      csrCanto
        .connect(net.signers.alice)
        .addClaimer(net.signers.alice.address, net.signers.alice.address)
    ).to.be.revertedWith("Only admin can add an address as a claimer.");
  });

  it('should revert if not admin delete an address from the claimers list', async function () {
    await expect(csrCanto.connect(net.signers.alice).delClaimer(net.signers.alice.address))
      .to.be.revertedWith("Only admin can delete an address from the claimers list.");
  });

  it('should revert if add claimer that is already in the claimers list', async function () {
    await expect(
      csrCanto
        .connect(net.signers.admin)
        .addClaimer(net.signers.alice.address, net.signers.alice.address)
    ).to.be.fulfilled;
    await expect(
      csrCanto
        .connect(net.signers.admin)
        .addClaimer(net.signers.alice.address, net.signers.alice.address)
    ).to.be.revertedWith("Address already in the claimers list.");
  });

  it('should revert if delete claimer that is not in the claimers list', async function () {
    await expect(
      csrCanto
        .connect(net.signers.admin)
        .delClaimer(net.signers.alice.address)
    ).to.be.revertedWith("Address already not in the claimers list.");
  });

  it('should allow the ADMIN address to add and remove claimers', async function () {
    // Alice wraps 100 $CANTO
    await csrCanto.connect(net.signers.alice).deposit({ value: 100 });
    expect(await csrCanto.claimersTotalSupply()).to.equal(0);

    // ADMIN adds a new claimer
    await expect(
      csrCanto
        .connect(net.signers.admin)
        .addClaimer(net.signers.alice.address, net.signers.alice.address)
    ).to.be.fulfilled;
    expect(await csrCanto.claimersTotalSupply()).to.equal(100);
    expect(await csrCanto.isClaimer(net.signers.alice.address)).to.equal(true);

    // ADMIN removes a claimer
    await expect(csrCanto.connect(net.signers.admin).delClaimer(net.signers.alice.address)).to
      .be.fulfilled;
    expect(await csrCanto.claimersTotalSupply()).to.equal(0);
    expect(await csrCanto.isClaimer(net.signers.alice.address)).to.equal(false);
  });
});
