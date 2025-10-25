// Real IPFS implementation using NFT.Storage

// NFT.Storage API configuration
const NFT_STORAGE_API_URL = 'https://api.nft.storage';
const NFT_STORAGE_TOKEN = import.meta.env.VITE_NFT_STORAGE_TOKEN;

// Check if we have a valid token
if (!NFT_STORAGE_TOKEN) {
  console.warn('⚠️ NFT.Storage token not found. Please set VITE_NFT_STORAGE_TOKEN in your .env file');
}

// Real-time status tracking
let uploadStatus = {
  isUploading: false,
  progress: 0,
  currentStep: '',
  error: null
};

// Event listeners for real-time updates
const statusListeners = new Set();

export const addStatusListener = (callback) => {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
};

export const getUploadStatus = () => uploadStatus;

const updateStatus = (updates) => {
  uploadStatus = { ...uploadStatus, ...updates };
  statusListeners.forEach(listener => listener(uploadStatus));
};

// Upload encrypted file to IPFS with real-time progress
export const uploadToIPFS = async (encryptedData, fileName) => {
  try {
    // Check if we have a valid token
    if (!NFT_STORAGE_TOKEN) {
      throw new Error('NFT.Storage token not configured. Please set VITE_NFT_STORAGE_TOKEN in your .env file');
    }

    updateStatus({ 
      isUploading: true, 
      progress: 0, 
      currentStep: 'Preparing file...',
      error: null 
    });

    // Create a Blob from the encrypted data
    updateStatus({ progress: 10, currentStep: 'Creating file blob...' });
    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const file = new File([blob], fileName, { 
      type: 'application/octet-stream' 
    });
    
    // Upload to NFT.Storage using direct API call
    updateStatus({ progress: 20, currentStep: 'Uploading to IPFS...' });
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('🔑 Using NFT.Storage token:', NFT_STORAGE_TOKEN.substring(0, 20) + '...');
    
    const response = await fetch(`${NFT_STORAGE_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_TOKEN}`,
      },
      body: formData,
    });
    
    updateStatus({ progress: 80, currentStep: 'Processing response...' });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('IPFS Upload Error:', response.status, response.statusText, errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('IPFS Upload Result:', result);
    const cid = result.value.cid;
    
    updateStatus({ 
      progress: 100, 
      currentStep: 'Upload complete!',
      isUploading: false 
    });
    
    return {
      cid,
      url: `https://${cid}.ipfs.nftstorage.link/`
    };
  } catch (error) {
    console.error('IPFS upload failed:', error);
    updateStatus({ 
      isUploading: false, 
      error: error.message,
      currentStep: 'Upload failed'
    });
    
    throw error;
  }
};

// Retrieve file from IPFS
export const retrieveFromIPFS = async (cid) => {
  try {
    // Fetch the file from IPFS using NFT.Storage gateway
    const response = await fetch(`https://${cid}.ipfs.nftstorage.link/`);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve file: ${response.status}`);
    }
    
    // Convert response to File object
    const blob = await response.blob();
    const file = new File([blob], 'encrypted-file', { type: 'application/octet-stream' });
    
    return file;
  } catch (error) {
    console.error('IPFS retrieval failed:', error);
    throw error;
  }
};

// Get file info from IPFS
export const getFileInfo = async (cid) => {
  try {
    // Get file info from NFT.Storage API
    const response = await fetch(`${NFT_STORAGE_API_URL}/${cid}`, {
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_TOKEN}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get file info: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      cid: result.value.cid,
      size: result.value.size,
      created: result.value.created,
      deals: result.value.deals
    };
  } catch (error) {
    console.error('Failed to get file info:', error);
    throw new Error(`Failed to get file info: ${error.message}`);
  }
};
