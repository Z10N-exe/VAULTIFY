import { Web3Storage } from 'web3.storage';

// Initialize Web3.Storage client
const getClient = () => {
  const token = process.env.REACT_APP_WEB3_STORAGE_TOKEN;
  if (!token) {
    throw new Error('Web3.Storage token not found. Please set REACT_APP_WEB3_STORAGE_TOKEN in your environment variables.');
  }
  return new Web3Storage({ token });
};

// Upload encrypted file to IPFS
export const uploadToIPFS = async (encryptedData, fileName) => {
  try {
    const client = getClient();
    
    // Create a File object from the encrypted data
    const file = new File([encryptedData], fileName, { 
      type: 'application/octet-stream' 
    });
    
    // Upload to IPFS
    const cid = await client.put([file], {
      name: `vaultifychain-${fileName}`,
      maxRetries: 3
    });
    
    return {
      cid,
      url: `https://${cid}.ipfs.w3s.link/${fileName}`
    };
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

// Retrieve file from IPFS
export const retrieveFromIPFS = async (cid) => {
  try {
    const client = getClient();
    const res = await client.get(cid);
    
    if (!res.ok) {
      throw new Error(`Failed to retrieve file: ${res.status}`);
    }
    
    const files = await res.files();
    if (files.length === 0) {
      throw new Error('No files found');
    }
    
    return files[0];
  } catch (error) {
    console.error('IPFS retrieval failed:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
};

// Get file info from IPFS
export const getFileInfo = async (cid) => {
  try {
    const client = getClient();
    const status = await client.status(cid);
    return status;
  } catch (error) {
    console.error('Failed to get file info:', error);
    throw new Error(`Failed to get file info: ${error.message}`);
  }
};
