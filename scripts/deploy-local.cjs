const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting local AVO deployment...");

  // Get the contract factory
  const AVO = await ethers.getContractFactory("AVO");
  
  console.log("📝 Deploying AVO contract...");
  
  // Deploy the contract
  const avo = await AVO.deploy();
  
  console.log("⏳ Waiting for deployment to be mined...");
  await avo.waitForDeployment();

  console.log("✅ AVO deployed successfully!");
  console.log("📍 Contract address:", await avo.getAddress());
  
  const contractAddress = await avo.getAddress();
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Next step: Update your frontend with the contract address:", contractAddress);
  console.log("💡 Add this to your .env file: VITE_CONTRACT_ADDRESS=" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
