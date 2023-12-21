import fs from 'fs';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-preprocessor';
import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

function getRemappings() {
  return fs
    .readFileSync('remappings.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trim().split('='));
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    cache: './cache/hardhat',
    artifacts: './artifacts/hardhat',
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 8000000,
    },
    testnet: {
      url: 'https://canto-testnet.plexnode.wtf',
      chainId: 7701,
      accounts: [process.env.DEPLOYER_KEY!],
    },
    mainnet: {
      url: 'https://mainnode.plexnode.org:8545',
      chainId: 7700,
      accounts: [process.env.DEPLOYER_KEY!],
    },
  },
};

export default config;
