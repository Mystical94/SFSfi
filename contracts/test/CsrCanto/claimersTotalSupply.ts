import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { expect } from 'chai';
import { afterEachFn } from './utils';
import { main } from '../../scripts/deployAll';

describe('claimersTotalSupply', async function () {
  let net: any;
  let csrCanto: Contract;

  before(async function () {
    net = await main();
    const CsrCanto: ContractFactory = await ethers.getContractFactory('CsrCanto');
    csrCanto = CsrCanto.attach(net.contracts.csrCanto);
  });

  this.afterEach(() => afterEachFn(csrCanto));

  it('= 0 when no claimers', async function () {
    expect(await csrCanto.claimersTotalSupply()).to.equal(0);
  });

  it('= 0 when Alice wraps 100 $CANTO', async function () {
    await csrCanto.connect(net.signers.alice).deposit({ value: 100 });
    expect(await csrCanto.claimersTotalSupply()).to.equal(0);
  });

  it('= 100 when Alice registers as a claimer', async function () {
    await csrCanto.connect(net.signers.alice).register();
    expect(await csrCanto.claimersTotalSupply()).to.equal(100);
  });

  it('= 75 when Alice unwraps 25 $csrCANTO', async function () {
    await csrCanto.connect(net.signers.alice).withdraw(25);
    expect(await csrCanto.claimersTotalSupply()).to.equal(75);
  });

  it('= 50 when Alice send 25 $csrCANTO to Bob', async function () {
    await csrCanto.connect(net.signers.alice).transfer(net.signers.bob.address, 25);
    expect(await csrCanto.claimersTotalSupply()).to.equal(50);
  });

  it('= 75 when Bob registers as a claimer', async function () {
    await csrCanto.connect(net.signers.bob).register();
    expect(await csrCanto.claimersTotalSupply()).to.equal(75);
  });

  it('= 25 when Admin remove Alice from claimers', async function () {
    await csrCanto.connect(net.signers.admin).delClaimer(net.signers.alice.address);
    expect(await csrCanto.claimersTotalSupply()).to.equal(25);
  });

  it('= 0 when Admin remove Bob from claimers', async function () {
    await csrCanto.connect(net.signers.admin).delClaimer(net.signers.bob.address);
    expect(await csrCanto.claimersTotalSupply()).to.equal(0);
  });

  it('= totalSupply when Admin add both Alice and Bob to claimers', async function () {
    await csrCanto
      .connect(net.signers.admin)
      .addClaimer(net.signers.alice.address, net.signers.alice.address);
    await csrCanto
      .connect(net.signers.admin)
      .addClaimer(net.signers.bob.address, net.signers.bob.address);
    expect(await csrCanto.claimersTotalSupply()).to.equal(await csrCanto.totalSupply());
  });
});
