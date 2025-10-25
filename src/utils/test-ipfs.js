// Simple IPFS test utility
export const testIPFSConnection = async () => {
  console.log('🧪 Testing IPFS connection...');
  
  try {
    // Check if token is configured
    const token = import.meta.env.VITE_NFT_STORAGE_TOKEN;
    console.log('🔑 Token configured:', !!token);
    
    if (!token || token === 'your_nft_storage_token_here') {
      throw new Error('NFT.Storage token not configured. Please get a token from https://nft.storage/login/ and set VITE_NFT_STORAGE_TOKEN in your .env file');
    }
    
    // Test with a small file
    const testData = 'Hello, AVO! This is a test file.';
    const testBlob = new Blob([testData], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', testFile);
    
    console.log('📤 Uploading test file...');
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ IPFS test successful!');
    console.log('📋 CID:', result.value.cid);
    console.log('🔗 URL:', `https://${result.value.cid}.ipfs.nftstorage.link/`);
    
    return {
      success: true,
      cid: result.value.cid,
      url: `https://${result.value.cid}.ipfs.nftstorage.link/`
    };
  } catch (error) {
    console.error('❌ IPFS test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
