// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Get the account to deploy the contract
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  // Deploy the SBT contract
  const SBT = await ethers.getContractFactory("SBT");
  const sbt = await SBT.deploy(deployer.address);
  
  await sbt.waitForDeployment();
  
  const contractAddress = await sbt.getAddress();
  console.log("SBT contract deployed to:", contractAddress);
  
  console.log("To integrate with your frontend, update the SBT_CONTRACT_ADDRESS in useSBTContract.ts with this address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });