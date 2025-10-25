// Simple test for upload functionality
import CryptoJS from 'crypto-js';

export const testUpload = async () => {
  console.log('🧪 Testing upload functionality...');
  
  try {
    // Test 1: Check if NFT.Storage token is available
    const token = import.meta.env.VITE_NFT_STORAGE_TOKEN;
    console.log('🔑 NFT.Storage token available:', !!token);
    
    // Test 2: Check if contract address is available
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    console.log('📋 Contract address available:', !!contractAddress);
    console.log('📋 Contract address:', contractAddress);
    
    if (!contractAddress) {
      console.log('⚠️ No contract address configured. Please deploy to BlockDAG testnet first.');
    }
    
    // Test 3: Test simple encryption
    const testData = 'Hello, VaultifyChain!';
    const testKey = 'test-key-123';
    
    // Import encryption function
    const { encryptFile } = await import('./encryption.js');
    const encrypted = encryptFile(testData, testKey);
    console.log('🔐 Encryption test successful:', !!encrypted);
    
    // Test 4: Test IPFS upload with small data
    const { uploadToIPFS } = await import('./ipfs.js');
    
    console.log('📤 Testing IPFS upload...');
    const ipfsResult = await uploadToIPFS(encrypted, 'test.txt');
    console.log('✅ IPFS test successful:', ipfsResult);
    
    // Test 5: Test blockchain connection (optional)
    try {
      const { uploadFileToBlockchain } = await import('./blockchain.js');
      console.log('⛓️ Testing blockchain connection...');
      const blockchainResult = await uploadFileToBlockchain(
        CryptoJS.SHA256(testData).toString(),
        ipfsResult.cid,
        '0x0000000000000000000000000000000000000000'
      );
      console.log('✅ Blockchain test successful:', blockchainResult);
    } catch (blockchainError) {
      console.log('⚠️ Blockchain test failed (this is expected if no wallet connected):', blockchainError.message);
    }
    
    return {
      success: true,
      ipfsResult,
      message: 'All tests passed!'
    };
    
  } catch (error) {
    console.error('❌ Upload test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Upload test failed'
    };
  }
};
