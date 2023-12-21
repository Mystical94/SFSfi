import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { expect } from 'chai';
import { afterEachFn } from './utils';
import { main } from '../../scripts/deployAll';

describe('Wrap / Unwrap', async function () {
  let net: any;
  let csrCanto: Contract;

  before(async function () {
    net = await main();
    const CsrCanto: ContractFactory = await ethers.getContractFactory('CsrCanto');
    csrCanto = CsrCanto.attach(net.contracts.csrCanto);
  });

  this.afterEach(() => afterEachFn(csrCanto));

  it('should revert plain $CANTO transfer that is not from Turnstile contract', async function () {
    await expect(
      net.signers.alice.sendTransaction({
        to: csrCanto.address,
        value: 100,
      })
    ).to.be.revertedWith('Accept receiving plain $CANTO transfers only from turnstile contract.');
  });

  it('should make Alice to wrap 100 $CANTO to $csrCANTO', async function () {
    await csrCanto.connect(net.signers.alice).deposit({ value: 100 });
    expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(100);
    expect(await csrCanto.totalSupply()).to.equal(100);
  });

  it('should make Bob to wrap 50 $CANTO to $csrCANTO', async function () {
    await csrCanto.connect(net.signers.bob).deposit({ value: 50 });
    expect(await csrCanto.balanceOf(net.signers.bob.address)).to.equal(50);
  });

  it('should prevent Alice to unwrap more (101) than their $csrCANTO balance', async function () {
    await expect(csrCanto.connect(net.signers.alice).withdraw(101)).to.be.revertedWith(
      'Insufficient balance.'
    );
  });

  it('should make Alice unwrap 100 $csrCANTO to $CANTO', async function () {
    await csrCanto.connect(net.signers.alice).withdraw(100);
    expect(await csrCanto.balanceOf(net.signers.alice.address)).to.equal(0);
  });
});
