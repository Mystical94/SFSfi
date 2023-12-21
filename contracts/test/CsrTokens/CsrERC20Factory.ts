import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { expect } from 'chai';
import { main } from '../../scripts/deployAll';

describe('CsrERC20Factory pullFundsFromTurnstile(address csrERC20)', async function () {
  let net: any;
  let csrCanto: Contract;
  let turnstile: Contract;
  let turnstileTokenId: number;
  let csrERC20Factory: Contract;

  let mck: Contract;
  let csrMCKaddr: string;

  beforeEach(async function () {
    net = await main();
    const CsrCanto: ContractFactory = await ethers.getContractFactory('CsrCanto');
    const Turnstile: ContractFactory = await ethers.getContractFactory(
      'contracts/mocks/canto/Turnstile.sol:Turnstile'
    );
    const CsrERC20Factory: ContractFactory = await ethers.getContractFactory('CsrERC20Factory');
    csrCanto = CsrCanto.attach(net.contracts.csrCanto);
    turnstile = Turnstile.attach(net.contracts.turnstile);
    csrERC20Factory = CsrERC20Factory.attach(net.contracts.csrERC20Factory);

    const MCK: ContractFactory = await ethers.getContractFactory('ERC20Mock');
    const csrERC20: ContractFactory = await ethers.getContractFactory('CsrERC20');

    /* mock ERC20 ($MCK) */
    mck = await MCK.connect(net.signers.god).deploy('Mock ERC20 token', 'MCK');
    await mck.deployed();

    /* create $csrMCK */
    const txResponse = await csrERC20Factory.connect(net.signers.admin).create(mck.address);
    csrMCKaddr = (await txResponse.wait()).events.find((e) => e.event === 'Created').args[
      'csrERC20'
    ];

    /* set cron address to bot */
    await csrERC20Factory.connect(net.signers.admin).setCron(net.signers.bot.address);

    turnstileTokenId = await turnstile.getTokenId(csrMCKaddr);
  });

  it('should refund the tx cost with a part of the CSR pulled', async () => {
    await turnstile
      .connect(net.signers.god)
      .distributeFees(turnstileTokenId, { value: 1000000000000000 });

    const balanceBefore = await net.signers.bot.getBalance();

    const tx = await csrERC20Factory.connect(net.signers.bot).pullFundsFromTurnstile(csrMCKaddr);
    const receipt = await tx.wait();
    const feeSpent = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);

    const balanceAfter = await net.signers.bot.getBalance();

    expect(balanceBefore).to.be.eq(balanceAfter);
    expect(await ethers.provider.getBalance(csrMCKaddr)).to.be.eq(1000000000000000 - feeSpent);
  });

  it('should not refund the bot if the CSR is insufficient', async () => {
    await turnstile.connect(net.signers.god).distributeFees(turnstileTokenId, { value: 100 });

    expect(await csrERC20Factory.connect(net.signers.bot).pullFundsFromTurnstile(csrMCKaddr)).not.to
      .be.reverted;

    expect(await ethers.provider.getBalance(csrMCKaddr)).to.be.eq(100);
  });
});
