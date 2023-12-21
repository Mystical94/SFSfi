import hre, { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';
import { pretty } from '../utils/prettier';

export async function main() {
  const pathOfStakingLPRewards = path.resolve(
    __dirname,
    '../artifacts/hardhat/contracts/LP/StakingLPRewards.sol/StakingLPRewards.json'
  );
  const StakingLPRewardsArtifacts = fs.readFileSync(pathOfStakingLPRewards, {
    encoding: 'utf-8',
  });

  const pathOfLP = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const LPFilePath = path.join(pathOfLP, 'LP.json');
  const LPDeploymentsInfo = JSON.parse(
    fs.readFileSync(LPFilePath, {
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

  const StakingLPRewards = await ethers.deployContract('StakingLPRewards', [
    '',
    LPDeploymentsInfo.address,
    StakeManagerDeploymentsInfo.address,
  ]);
  await StakingLPRewards.deployed();

  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'StakingLPRewards.json');

  if (!fs.existsSync(pathOfDeployments)) {
    fs.mkdirSync(pathOfDeployments, { recursive: true });
  }
  fs.writeFileSync(
    filePath,
    pretty(
      JSON.stringify({
        address: StakingLPRewards.address,
        abi: JSON.parse(StakingLPRewardsArtifacts).abi,
      })
    ),
    { encoding: 'utf-8' }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
