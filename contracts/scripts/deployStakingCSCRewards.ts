import hre, { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';
import { pretty } from '../utils/prettier';

export async function main() {
  const pathOfStakingCSCRewards = path.resolve(
    __dirname,
    '../artifacts/hardhat/contracts/CSC/StakingCSCRewards.sol/StakingCSCRewards.json'
  );
  const StakingCSCRewardsArtifacts = fs.readFileSync(pathOfStakingCSCRewards, {
    encoding: 'utf-8',
  });

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

  const StakingCSCRewards = await ethers.deployContract('StakingCSCRewards', [
    await (await ethers.getSigners())[0].getAddress(),
    CSCDeploymentsInfo.address,
    StakeManagerDeploymentsInfo.address,
  ]);
  await StakingCSCRewards.deployed();

  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'StakingCSCRewards.json');

  if (!fs.existsSync(pathOfDeployments)) {
    fs.mkdirSync(pathOfDeployments, { recursive: true });
  }
  fs.writeFileSync(
    filePath,
    pretty(
      JSON.stringify({
        address: StakingCSCRewards.address,
        abi: JSON.parse(StakingCSCRewardsArtifacts).abi,
      })
    ),
    { encoding: 'utf-8' }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
