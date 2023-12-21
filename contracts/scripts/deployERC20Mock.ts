import hre, { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

export async function main() {
  const pathOfAbi = path.resolve(
    __dirname,
    '../artifacts/hardhat/contracts/mocks/ERC20Mock.sol/ERC20Mock.json'
  );
  const { abi } = JSON.parse(
    fs.readFileSync(pathOfAbi, {
      encoding: 'utf-8',
    })
  );

  const Mock = await ethers.deployContract('ERC20Mock', ['ERC20Mock', '$MOCK']);
  await Mock.deployed();
  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'ERC20Mock.json');
  if (!fs.existsSync(pathOfDeployments)) {
    fs.mkdirSync(pathOfDeployments, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify({ address: Mock.address, abi }), { encoding: 'utf-8' });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
