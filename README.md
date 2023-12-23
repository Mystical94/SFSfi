# SFSfi

SFSfi is a protocol which creates composable building blocks for other protocols and especially users on the Mode Blockchain to harness the power of SFS and gas yields with one click

## 📝 Project Description

### ✍ Project Overview
- SFSfi aims to provide a protocol on the Mode Blockchain that enables users to easily leverage the Sequencer Fee Sharing (SFS) mechanism.
- By doing so, it allows users to earn a portion of transaction fees that would otherwise be burned according to Ethereum's EIP-1559.
- The protocol introduces a wrapped version of ETH called sfsETH, which is ERC-20 compliant and SFS enabled.
- The project seeks to create a sustainable source of yield for users and protocol participants.

### 😎 Inspiration
The inspiration behind SFSfi likely stems from several key trends and challenges within the decentralized finance (DeFi) space, as well as the Ethereum ecosystem. Inspirations that have led to the development of SFSfi:

- Incentivizing Long-Term Holding: Encouraging users to hold their assets for the long term is a common goal within the blockchain and crypto space. The idea of providing a risk-free yield for users holding ETH aligns with the broader objective of incentivizing long-term holding, rather than frequent buying and selling.

- DeFi Yield Farming and Liquidity Mining: Yield farming and liquidity mining have been popular mechanisms in the DeFi space to incentivize users to provide liquidity and participate in various protocols. SFSfi introduces a unique twist by allowing users to earn yields through the redirection of transaction fees, providing an alternative or additional source of revenue compared to traditional yield farming.

- Creation of a Liquidity-Enhanced ERC-20 ETH: The development of sfsETH as a wrapped version of ETH with enhanced liquidity and yield-generating capabilities caters to the demand for more versatile and liquid versions of cryptocurrencies within the DeFi ecosystem.

- Sustainable Revenue for Protocols: Protocols often seek sustainable revenue streams to support ongoing development and maintenance. SFSfi's focus on redirecting transaction fees to create a treasury that benefits the entire ecosystem provides a potential solution for protocols looking to establish long-term sustainability.

- Simplicity and Composability: The concept of offering composable building blocks within the SFSfi protocol aligns with the trend of creating decentralized finance protocols that are easy to integrate and use. The one-click solution for harnessing the power of SFS and gas yields aims to simplify the user experience.

### 📺 What it does
- SFSfi Protocol: SFSfi integrates the SFS mechanism into its protocol, creating a framework for users and other protocols on the Mode Blockchain to easily harness the benefits of Sequencer Fee Sharing. It provides composable building blocks that simplify the process of integrating SFS and gas yields, offering a one-click solution.

- sfsETH (Wrapped ETH with SFS): SFSfi introduces sfsETH, a wrapped version of ETH that adheres to the ERC-20 standard and is equipped with SFS capabilities. Revenues generated from the SFS NFT, which collects redirected transaction fees, are distributed to sfsETH holders. sfsETH provides users with a risk-free yield on their ETH holdings.

### ✒ How we built it
- Smart Contract Development: Develop smart contracts that implement the SFS mechanism, including the logic for redirecting transaction fees to an NFT owned by the contract deployer. Deploy smart contracts and the SFSfi protocol on the Mode Blockchain.

- sfsETH Implementation: Develop the sfsETH token, ensuring it complies with the ERC-20 standard and includes the necessary functionality to receive and distribute revenues from the SFS NFT.

- User Interface (UI) and User Experience (UX): Design and develop a user-friendly interface for users to interact with the SFSfi protocol. Implement a one-click solution for users to easily harness the benefits of SFS and gas yields.

- Testing: Conduct rigorous testing of smart contracts, protocols, and user interfaces to identify and fix potential bugs or vulnerabilities.

- Integration with the Mode Blockchain: Ensure seamless integration with the Mode Blockchain, addressing any specific requirements or considerations unique to the blockchain.

### ⚔ Challenges we ran into
- User Experience (UI/UX): Creating an intuitive and user-friendly interface is crucial for mass adoption. Designing a seamless user experience, especially for complex DeFi protocols, was challenging.
- It was our first time working with Sequencer Fee Sharing mechanism but it was quite innovative and we learned a lot.

### ☄️ Value Propositions
- Hodling with Yield: Users can continue to hold ETH while earning a risk-free yield from the redirected transaction fees.
- Treasury Growth: The protocol's treasury benefits from the redirected fees, creating a sustainable source of yield for the entire ecosystem.
- Liquidity and Demand: sfsETH is positioned as the most liquid form of ERC-20 ETH, making it an attractive asset within the decentralized finance (DeFi) space.
- Unique DeFi Product: Due to its liquidity and demand, sfsETH becomes a valuable asset for integration within various DeFi products.

### ☄️ What's next?
- Currently, SFSfi only supports native coin (ETH) wrapping. Next step is to make wrapping up of every ERC-20 into sfsERC-20Token.
- Deploying SFSfi on Mode Mainnet as soon as possible.
- Auditing the smart contracts.
- Future UX improvements (although the website is mobile-friendly). The possibilities are endless!

### 🌟 Conclusion
- SFSfi facilitates the redirection of transaction fees through the SFS mechanism, creating a sustainable revenue stream for users and the protocol itself. Through the introduction of sfsETH, users can earn risk-free yields on their ETH holdings, and the protocol aims to enhance liquidity and demand within the DeFi ecosystem on the Mode Blockchain.

#### Credits
- The project is a fork of csrCanto and some parts of the code has been used.
- The deployment on the Mode Blockchain and its integration with the Mode Blockchain is our original work.
- The UI has also been modified according to the Mode Blockchain

### 💪 Deployed Contract Addresses (Mode Sepolia Testnet)
- sfsETH Contract: [0x264D76222F0c631b3397F4554008CdE7DD601D7c](https://sepolia.explorer.mode.network/address/0x264D76222F0c631b3397F4554008CdE7DD601D7c)

### 💪 Bounty Entered
- Go Fork Yourself
- SFS Killer
- Gigabrainz
- Best Stablecoin

### 💻 Deploying SFSfi on the local device

#### Pre-requisites

- Node version should be >=16.0.0
- npm version should be >=9.0.0

Clone the repository

move into the dapp folder

```sh
cd dapp
```

install dependencies using **yarn** or **npm**

```sh
yarn

or

npm install
```

start the development server
```sh
yarn dev

or

npm run dev
```

build with production mode
```sh
yarn build

or

npm run build
```
