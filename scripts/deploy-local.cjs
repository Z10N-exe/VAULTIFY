const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting local VaultifyChain deployment...");

  // Get the contract factory
  const VaultifyChain = await ethers.getContractFactory("VaultifyChain");
  
  console.log("📝 Deploying VaultifyChain contract...");
  
  // Deploy the contract
  const vaultifyChain = await VaultifyChain.deploy();
  
  console.log("⏳ Waiting for deployment to be mined...");
  await vaultifyChain.waitForDeployment();

  console.log("✅ VaultifyChain deployed successfully!");
  console.log("📍 Contract address:", await vaultifyChain.getAddress());
  
  const contractAddress = await vaultifyChain.getAddress();
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
