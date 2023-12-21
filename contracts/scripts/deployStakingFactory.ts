import hre, { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';
import { pretty } from '../utils/prettier';

export default async function main() {
  const pathOfCSC = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const CSCFilePath = path.join(pathOfCSC, 'CSC.json');
  const CSCDeploymentsInfo = JSON.parse(
    fs.readFileSync(CSCFilePath, {
      encoding: 'utf-8',
    })
  );

  const pathOfStakeManager = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const StakeManagerFilePath = path.join(pathOfStakeManager, 'StakeManager.json');
  const StakeManagerDeploymentsInfo = JSON.parse(
    fs.readFileSync(StakeManagerFilePath, {
      encoding: 'utf-8',
    })
  );

  const pathOfStakingFactory = path.resolve(
    __dirname,
    '../artifacts/hardhat/contracts/CSC/StakingFactory.sol/StakingFactory.json'
  );
  const StakeManagerArtifacts = fs.readFileSync(pathOfStakingFactory, {
    encoding: 'utf-8',
  });

  const signer = (await ethers.getSigners())[0];

  const StakingFactory = await ethers.deployContract(
    'StakingFactory',
    [CSCDeploymentsInfo.address, StakeManagerDeploymentsInfo.address],
    signer
  );
  await StakingFactory.deployed();
  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'StakingFactory.json');
  if (!fs.existsSync(pathOfDeployments)) {
    fs.mkdirSync(pathOfDeployments, { recursive: true });
  }
  fs.writeFileSync(
    filePath,
    pretty(
      JSON.stringify({
        address: StakingFactory.address,
        abi: JSON.parse(StakeManagerArtifacts).abi,
      })
    ),
    { encoding: 'utf-8' }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
