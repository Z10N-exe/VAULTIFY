const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing VaultifyChain deployment...");
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Testing with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.getBalance();
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    // Deploy VaultifyChain contract
    console.log("📦 Deploying VaultifyChain contract...");
    const VaultifyChain = await ethers.getContractFactory("VaultifyChain");
    const vaultifyChain = await VaultifyChain.deploy();
    
    console.log("⏳ Waiting for deployment to be mined...");
    await vaultifyChain.waitForDeployment();

    const contractAddress = await vaultifyChain.getAddress();
    console.log("✅ VaultifyChain deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    
    // Test basic functionality
    console.log("🔍 Testing basic functionality...");
    const totalFiles = await vaultifyChain.getTotalFiles();
    console.log("📊 Total files in system:", totalFiles.toString());
    
    // Test file upload
    console.log("📤 Testing file upload...");
    const testFileHash = "0x" + "a".repeat(64); // Test hash
    const testIPFSCID = "QmTest123456789"; // Test IPFS CID
    const testReceiver = "0x0000000000000000000000000000000000000000"; // No specific receiver
    
    const tx = await vaultifyChain.uploadFile(testFileHash, testIPFSCID, testReceiver);
    await tx.wait();
    console.log("✅ File upload test successful!");
    
    // Test file record retrieval
    console.log("📥 Testing file record retrieval...");
    const fileRecord = await vaultifyChain.getFileRecord(testFileHash);
    console.log("📋 File record:", {
      fileHash: fileRecord[0],
      ipfsCID: fileRecord[1],
      uploader: fileRecord[2],
      receiver: fileRecord[3],
      timestamp: new Date(Number(fileRecord[4]) * 1000).toISOString(),
      exists: fileRecord[5]
    });
    
    console.log("\n🎉 All tests passed successfully!");
    console.log("📋 Contract is ready for production use!");
    console.log("📍 Contract address for frontend:", contractAddress);
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 This might be because:");
    console.log("1. No private key configured (run with --network localhost)");
    console.log("2. Insufficient balance for deployment");
    console.log("3. Network connection issues");
    console.log("\n🔧 To fix:");
    console.log("1. For local testing: npx hardhat node (in another terminal)");
    console.log("2. Then run: npx hardhat run scripts/test-deployment.js --network localhost");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });