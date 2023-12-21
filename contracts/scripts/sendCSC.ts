import hre, { ethers } from 'hardhat';
import path from 'path';
import fs from 'fs';

export async function main() {
  const pathOfCSC = path.resolve(__dirname, '../deployments/' + hre.network.name + '/CSC.json');
  const CSCArtifacts = fs.readFileSync(pathOfCSC, {
    encoding: 'utf-8',
  });
  const CSCInfo = JSON.parse(CSCArtifacts);
  const CSCContract = new ethers.Contract(
    CSCInfo.address,
    CSCInfo.abi,
    (await ethers.getSigners())[0]
  );

  CSCContract.transfer('', ethers.utils.parseEther('100'));
}

main();
