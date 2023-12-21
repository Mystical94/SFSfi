import { ethers } from 'hardhat';

export async function main(verbose: boolean = false) {
  const print = (msg: string) => (verbose ? console.log(msg) : null);

  const contracts = {
    turnstile: '',
    csrCanto: '',
    csrERC20Factory: '',
  };

  // This is just a convenience check
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const s = await ethers.getSigners();
  const signers = {
    god: s[0],
    admin: s[1],
    bot: s[2],
    alice: s[3],
    bob: s[4],
    carol: s[5],
    cscStakers: s[6]
  };

  print(
    `    God balance: ${(
      await signers.god.getBalance()
    ).toString()} - addr: ${await signers.god.getAddress()}`
  );
  print(
    `  Admin balance: ${(
      await signers.admin.getBalance()
    ).toString()} - addr: ${await signers.admin.getAddress()}`
  );
  print(
    `Manager balance: ${(
      await signers.bot.getBalance()
    ).toString()} - addr: ${await signers.bot.getAddress()}`
  );
  print(
    `  Alice balance: ${(
      await signers.alice.getBalance()
    ).toString()} - addr: ${await signers.alice.getAddress()}`
  );
  print(
    `    Bob balance: ${(
      await signers.bob.getBalance()
    ).toString()} - addr: ${await signers.bob.getAddress()}`
  );
  print(
    `  Carol balance: ${(
      await signers.carol.getBalance()
    ).toString()} - addr: ${await signers.carol.getAddress()}`
  );
  print('');

  const Turnstile = await ethers.getContractFactory('contracts/mocks/canto/Turnstile.sol:Turnstile');
  const turnstile = await Turnstile.connect(signers.god).deploy();
  await turnstile.deployed();

  contracts.turnstile = turnstile.address;
  print(`1. God deployed Turnstile at ${contracts.turnstile}`);

  const CsrCanto = await ethers.getContractFactory('CsrCanto');
  const csrCanto = await CsrCanto.connect(signers.admin).deploy(turnstile.address);
  await csrCanto.deployed();

  contracts.csrCanto = csrCanto.address;
  print(`2. Admin deployed CsrCanto at ${contracts.csrCanto}`);
  
  const CsrERC20Factory = await ethers.getContractFactory('CsrERC20Factory');
  const csrERC20Factory = await CsrERC20Factory.connect(signers.admin).deploy(
    turnstile.address,
    csrCanto.address,
    signers.cscStakers.address
  );
  await csrERC20Factory.deployed();

  contracts.csrERC20Factory = csrERC20Factory.address;
  print(`3. Admin deployed CsrERC20Factory at ${contracts.csrCanto}`);
    
  print('');
  return {
    contracts,
    signers,
  };
}
