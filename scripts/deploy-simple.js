const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VaultifyChain deployment to BlockDAG...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.formatEther(balance), "BDAG");
  
  if (balance < ethers.parseEther("0.1")) {
    console.log("⚠️  Warning: Low balance! Get test BDAG from BlockDAG faucet:");
    console.log("🔗 https://docs.blockdagnetwork.io/block-explorer/evm/faucet");
  }

  // Deploy VaultifyChain contract
  console.log("📦 Deploying VaultifyChain contract...");
  const VaultifyChain = await ethers.getContractFactory("VaultifyChain");
  const vaultifyChain = await VaultifyChain.deploy();
  
  console.log("⏳ Waiting for deployment to be mined...");
  await vaultifyChain.waitForDeployment();

  const contractAddress = await vaultifyChain.getAddress();
  console.log("✅ VaultifyChain deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 BlockDAG Explorer:", `https://explorer-testnet.blockdag.network/address/${contractAddress}`);
  
  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const totalFiles = await vaultifyChain.getTotalFiles();
  console.log("📊 Total files in system:", totalFiles.toString());

  // Save deployment info
  const deploymentInfo = {
    network: "blockdag-testnet",
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  console.log("💾 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Next steps:");
  console.log("1. Update your frontend with the contract address:", contractAddress);
  console.log("2. Add BlockDAG network to MetaMask if not already added");
  console.log("3. Test file upload and access logging");
  console.log("4. Monitor events on BlockDAG Explorer");
  
  // Update the environment variable
  console.log("\n🔧 To update your frontend, set this environment variable:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

