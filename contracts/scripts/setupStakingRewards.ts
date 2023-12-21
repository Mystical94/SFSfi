import hre, { ethers } from 'hardhat';
import path from 'path';
import fs from 'fs';
import CSCDeployment from './deployCSC';
import StakeManager from './deployStakeManager';
import StakingFactory from './deployStakingFactory';

export async function main() {
  // TODO DEV Nonce issue
  // await CSCDeployment();
  // await StakeManager();
  // await StakingFactory();

  const pathOfStakeManager = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const StakeManagerFilePath = path.join(pathOfStakeManager, 'StakeManager.json');
  const StakeManagerDeploymentsInfo = JSON.parse(
    fs.readFileSync(StakeManagerFilePath, {
      encoding: 'utf-8',
    })
  );

  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'StakingCSCRewards.json');
  const StakingRewardsDeploymentsInfo = JSON.parse(
    fs.readFileSync(filePath, {
      encoding: 'utf-8',
    })
  );

  const signer = (await ethers.getSigners())[0];

  const StakingManagerContract = new ethers.Contract(
    StakeManagerDeploymentsInfo.address,
    StakeManagerDeploymentsInfo.abi,
    signer
  );

  const pathOfCSC = path.resolve(__dirname, '../deployments/' + hre.network.name + '/CSC.json');
  const CSCArtifacts = fs.readFileSync(pathOfCSC, {
    encoding: 'utf-8',
  });
  const CSCInfo = JSON.parse(CSCArtifacts);
  const CSCContract = new ethers.Contract(CSCInfo.address, CSCInfo.abi, signer);

  await CSCContract.transfer(StakingManagerContract.address, ethers.utils.parseEther('500'));

  await StakingManagerContract.deployStakingContract();

  const stakingRewardsContractsAddress = await StakingManagerContract.getWhitelistedContracts();

  const StakingRewardsContract = new ethers.Contract(
    stakingRewardsContractsAddress[0],
    StakingRewardsDeploymentsInfo.abi,
    signer
  );
  await StakingRewardsContract.setRewardsDuration(ethers.BigNumber.from('2592000'));
  await CSCContract.transfer(StakingRewardsContract.address, ethers.utils.parseEther('500000'));
  await StakingRewardsContract.notifyRewardAmount(ethers.utils.parseEther('500000'));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
