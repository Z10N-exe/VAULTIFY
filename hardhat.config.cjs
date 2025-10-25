require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // BlockDAG Testnet Configuration
    blockdagTestnet: {
      url: "https://relay.awakening.bdagscan.com/",
      chainId: 1043, // BlockDAG testnet chainId
      gasPrice: 2000000000, // 2 gwei
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // BlockDAG Mainnet Configuration
    blockdagMainnet: {
      url: "https://rpc.blockdag.network",
      chainId: 30, // BlockDAG mainnet chainId
      gasPrice: 2000000000,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};