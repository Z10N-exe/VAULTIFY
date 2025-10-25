const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting VaultifyChain deployment to BlockDAG...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "BDAG");
  
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    console.log("⚠️  Warning: Low balance! Get test BDAG from BlockDAG faucet:");
    console.log("🔗 https://docs.blockdagnetwork.io/block-explorer/evm/faucet");
  }

  // Deploy AVO contract
  console.log("📦 Deploying AVO contract...");
  const AVO = await ethers.getContractFactory("AVO");
  const avo = await AVO.deploy();
  
  console.log("⏳ Waiting for deployment to be mined...");
  await avo.waitForDeployment();

  console.log("✅ AVO deployed successfully!");
  const contractAddress = await avo.getAddress();
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 BlockDAG Explorer:", `https://explorer.blockdag.network/address/${contractAddress}`);
  
  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const totalFiles = await avo.getTotalFiles();
  console.log("📊 Total files in system:", totalFiles.toString());

  // Save deployment info
  const deploymentInfo = {
    network: "blockdag",
    contractAddress: vaultifyChain.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    gasUsed: "N/A" // Hardhat doesn't provide this easily
  };

  console.log("💾 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Next steps:");
  console.log("1. Update your frontend with the contract address:", vaultifyChain.address);
  console.log("2. Add BlockDAG network to MetaMask if not already added");
  console.log("3. Test file upload and access logging");
  console.log("4. Monitor events on BlockDAG Explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
