import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { expect } from 'chai';

const afterEachFn = async function (csrCanto: Contract) {
  // $csrCANTO tokens are wrapped $CANTO native tokens,
  // totalSupply should be equal to the contract $CANTO balance at any time
  const ETHbalance = await ethers.provider.getBalance(csrCanto.address);
  expect(await csrCanto.totalSupply()).to.equal(ETHbalance);
};

export { afterEachFn };
