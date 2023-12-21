import hre, { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

export async function main() {
  const pathOfAuction = path.resolve(
    __dirname,
    '../artifacts/hardhat/contracts/Auction.sol/Auction.json'
  );
  const AuctionArtifacts = fs.readFileSync(pathOfAuction, {
    encoding: 'utf-8',
  });

  const pathOfCSC = path.resolve(__dirname, '../deployments/testnet/CSC.json');
  const CSCDeployment = JSON.parse(
    fs.readFileSync(pathOfCSC, {
      encoding: 'utf-8',
    })
  );

  const signers = await ethers.getSigners();
  const Auction = await ethers.deployContract('Auction', [
    CSCDeployment.address,
    '0x51c0B122A5E8F09c432dd52974856E46f43f02c2',
    (await signers[0].provider!.getBlock('latest')).timestamp,
    (await signers[0].provider!.getBlock('latest')).timestamp * 30,
    await signers[0].getAddress(),
    1,
  ]);
  await Auction.deployed();
  const pathOfDeployments = path.resolve(__dirname, '../deployments/' + hre.network.name);
  const filePath = path.join(pathOfDeployments, 'Auction.json');
  if (!fs.existsSync(pathOfDeployments)) {
    fs.mkdirSync(pathOfDeployments, { recursive: true });
  }
  fs.writeFileSync(
    filePath,
    JSON.stringify({ address: Auction.address, abi: JSON.parse(AuctionArtifacts).abi }),
    { encoding: 'utf-8' }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
