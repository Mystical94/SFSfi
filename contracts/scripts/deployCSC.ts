import hre, { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';
import { pretty } from '../utils/prettier';

export default async function main() {
  const pathOfCSC = path.resolve(__dirname, '../artifacts/hardhat/contracts/CSC/CSC.sol/CSC.json');
  const CSCArtifacts = fs.readFileSync(pathOfCSC, {
    encoding: 'utf-8',
  });

  const signer = (await ethers.getSigners())[0];

  const CSC = await ethers.deployContract(
    'CSC',
    [
      'csrCanto Governance Token',
      'CSC',
      await signer.getAddress(),
      ethers.utils.parseEther('10000000'),
    ],
    signer
  );
  await CSC.deployed();
  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'CSC.json');
  if (!fs.existsSync(pathOfDeployments)) {
    fs.mkdirSync(pathOfDeployments, { recursive: true });
  }
  fs.writeFileSync(
    filePath,
    pretty(JSON.stringify({ address: CSC.address, abi: JSON.parse(CSCArtifacts).abi })),
    { encoding: 'utf-8' }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
