const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting AVO deployment to BlockDAG Testnet...");

  // Get the contract factory
  const AVO = await ethers.getContractFactory("AVO");
  
  console.log("📝 Deploying AVO contract to BlockDAG Testnet...");
  
  // Deploy the contract
  const avo = await AVO.deploy();
  
  console.log("⏳ Waiting for deployment to be mined...");
  await avo.waitForDeployment();

  const contractAddress = await avo.getAddress();
  console.log("✅ AVO deployed successfully to BlockDAG Testnet!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 Network: BlockDAG Testnet (Chain ID: 1043)");
  console.log("🌐 Explorer: https://explorer-testnet.blockdag.network");
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Next step: Update your frontend with the contract address:", contractAddress);
  console.log("💡 Add this to your .env file: VITE_CONTRACT_ADDRESS=" + contractAddress);
  console.log("🔧 Make sure to switch MetaMask to BlockDAG Testnet to interact with the contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
