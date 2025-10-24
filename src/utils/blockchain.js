import { ethers } from 'ethers';

// Smart contract ABI
const VAULTIFYCHAIN_ABI = [
  "function uploadFile(string memory _fileHash, string memory _ipfsCID, address _receiver) public",
  "function logAccess(string memory _fileHash) public",
  "function getFileRecord(string memory _fileHash) public view returns (string memory, string memory, address, address, uint256)",
  "event FileUploaded(string fileHash, address indexed uploader, address indexed receiver, uint256 timestamp)",
  "event FileAccessed(string fileHash, address indexed accessor, uint256 timestamp)"
];

// Contract address (you'll need to deploy this and update the address)
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x...';

// Initialize contract
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return new ethers.Contract(CONTRACT_ADDRESS, VAULTIFYCHAIN_ABI, signer);
};

// Upload file record to blockchain
export const uploadFileToBlockchain = async (fileHash, ipfsCID, receiverAddress) => {
  try {
    const contract = await getContract();
    
    const tx = await contract.uploadFile(fileHash, ipfsCID, receiverAddress);
    await tx.wait();
    
    return {
      txHash: tx.hash,
      success: true
    };
  } catch (error) {
    console.error('Blockchain upload failed:', error);
    throw new Error(`Failed to upload to blockchain: ${error.message}`);
  }
};

// Log file access
export const logFileAccess = async (fileHash) => {
  try {
    const contract = await getContract();
    
    const tx = await contract.logAccess(fileHash);
    await tx.wait();
    
    return {
      txHash: tx.hash,
      success: true
    };
  } catch (error) {
    console.error('Access logging failed:', error);
    throw new Error(`Failed to log access: ${error.message}`);
  }
};

// Get file record from blockchain
export const getFileRecord = async (fileHash) => {
  try {
    const contract = await getContract();
    const record = await contract.getFileRecord(fileHash);
    
    return {
      fileHash: record[0],
      ipfsCID: record[1],
      uploader: record[2],
      receiver: record[3],
      timestamp: new Date(Number(record[4]) * 1000)
    };
  } catch (error) {
    console.error('Failed to get file record:', error);
    throw new Error(`Failed to get file record: ${error.message}`);
  }
};

// Get audit logs for a user
export const getAuditLogs = async (userAddress) => {
  try {
    const contract = await getContract();
    
    // Get FileUploaded events
    const uploadFilter = contract.filters.FileUploaded(null, userAddress, null);
    const uploadEvents = await contract.queryFilter(uploadFilter);
    
    // Get FileAccessed events
    const accessFilter = contract.filters.FileAccessed(null, userAddress);
    const accessEvents = await contract.queryFilter(accessFilter);
    
    // Combine and sort events
    const allEvents = [...uploadEvents, ...accessEvents]
      .map(event => ({
        type: event.event,
        fileHash: event.args[0],
        user: event.args[1],
        timestamp: new Date(Number(event.args[2]) * 1000),
        txHash: event.transactionHash
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return allEvents;
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    throw new Error(`Failed to get audit logs: ${error.message}`);
  }
};
