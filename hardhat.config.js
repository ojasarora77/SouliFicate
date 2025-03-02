require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

// Private key from environment variables (use a placeholder if missing)
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84532
    }
  },
  paths: {
    sources: "./app/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};