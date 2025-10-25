import { ethers } from 'ethers';

// BlockDAG Network Configuration
const BLOCKDAG_CHAIN_ID = '0x413'; // 1043 in hex (BlockDAG testnet)
const BLOCKDAG_RPC_URL = 'https://relay.awakening.bdagscan.com/';
const BLOCKDAG_EXPLORER_URL = 'https://explorer-testnet.blockdag.network';

// Real-time blockchain status tracking
let blockchainStatus = {
  isConnected: false,
  isProcessing: false,
  currentTx: null,
  lastBlock: null,
  error: null
};

// Event listeners for real-time updates
const blockchainListeners = new Set();

export const addBlockchainListener = (callback) => {
  blockchainListeners.add(callback);
  return () => blockchainListeners.delete(callback);
};

export const getBlockchainStatus = () => blockchainStatus;

const updateBlockchainStatus = (updates) => {
  blockchainStatus = { ...blockchainStatus, ...updates };
  blockchainListeners.forEach(listener => listener(blockchainStatus));
};

// Real-time blockchain event monitoring
let eventMonitor = null;

export const startBlockchainMonitoring = async () => {
  if (eventMonitor) return;
  
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    updateBlockchainStatus({ isConnected: true });
    
    // Monitor new blocks
    provider.on('block', (blockNumber) => {
      updateBlockchainStatus({ 
        lastBlock: blockNumber,
        isConnected: true 
      });
    });
    
    // Monitor network changes
    window.ethereum.on('chainChanged', (chainId) => {
      updateBlockchainStatus({ 
        chainId: parseInt(chainId, 16),
        isConnected: true 
      });
    });
    
    // Monitor account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        updateBlockchainStatus({ isConnected: false });
      } else {
        updateBlockchainStatus({ isConnected: true });
      }
    });
    
    eventMonitor = provider;
  } catch (error) {
    console.error('Failed to start blockchain monitoring:', error);
    updateBlockchainStatus({ 
      isConnected: false, 
      error: error.message 
    });
  }
};

export const stopBlockchainMonitoring = () => {
  if (eventMonitor) {
    eventMonitor.removeAllListeners();
    eventMonitor = null;
  }
  updateBlockchainStatus({ isConnected: false });
};

// BlockDAG Network Functions
export const isBlockDAGNetwork = async () => {
  try {
    if (!window.ethereum) return false;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === BLOCKDAG_CHAIN_ID;
  } catch (error) {
    console.error('Error checking BlockDAG network:', error);
    return false;
  }
};

export const switchToBlockDAG = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BLOCKDAG_CONFIG.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BLOCKDAG_CONFIG.chainId,
              chainName: BLOCKDAG_CONFIG.chainName,
              nativeCurrency: BLOCKDAG_CONFIG.nativeCurrency,
              rpcUrls: BLOCKDAG_CONFIG.rpcUrls,
              blockExplorerUrls: BLOCKDAG_CONFIG.blockExplorerUrls,
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
    
    updateBlockchainStatus({ isConnected: true });
    return true;
  } catch (error) {
    console.error('Failed to switch to BlockDAG:', error);
    updateBlockchainStatus({ error: error.message });
    throw error;
  }
};

export const getBlockDAGNetworkInfo = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const blockNumber = await window.ethereum.request({ method: 'eth_blockNumber' });
    const block = await window.ethereum.request({ 
      method: 'eth_getBlockByNumber', 
      params: [blockNumber, false] 
    });

    return {
      chainId,
      blockHeight: parseInt(blockNumber, 16),
      lastBlockTime: new Date(parseInt(block.timestamp, 16) * 1000),
      isBlockDAG: chainId === BLOCKDAG_CHAIN_ID,
      networkName: chainId === BLOCKDAG_CHAIN_ID ? 'BlockDAG Network' : 'Unknown Network'
    };
  } catch (error) {
    console.error('Error getting BlockDAG network info:', error);
    throw error;
  }
};

// BlockDAG Smart Contract ABI for VaultifyChain
const VAULTIFYCHAIN_ABI = [
  "function uploadFile(string memory _fileHash, string memory _ipfsCID, address _receiver) public",
  "function logAccess(string memory _fileHash) public",
  "function getFileRecord(string memory _fileHash) public view returns (string memory, string memory, address, address, uint256)",
  "function getFileAccessLogs(string memory _fileHash) public view returns (address[] memory, uint256[] memory)",
  "function addAuthorizedUser(string memory _fileHash, address _user) public",
  "function removeAuthorizedUser(string memory _fileHash, address _user) public",
  "event FileUploaded(string fileHash, address indexed uploader, address indexed receiver, uint256 timestamp)",
  "event FileAccessed(string fileHash, address indexed accessor, uint256 timestamp)",
  "event UserAuthorized(string fileHash, address indexed user, address indexed authorizer)",
  "event UserDeauthorized(string fileHash, address indexed user, address indexed authorizer)"
];

// BlockDAG Contract address (deploy to BlockDAG network)
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// BlockDAG Network Configuration
const BLOCKDAG_CONFIG = {
  chainId: '0x413', // BlockDAG testnet chain ID (1043 in decimal)
  chainName: 'BlockDAG Testnet',
  rpcUrls: ['https://relay.awakening.bdagscan.com/'],
  blockExplorerUrls: ['https://explorer-testnet.blockdag.network'],
  nativeCurrency: {
    name: 'BlockDAG',
    symbol: 'BDAG',
    decimals: 18
  }
};

// Initialize BlockDAG contract
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return new ethers.Contract(CONTRACT_ADDRESS, VAULTIFYCHAIN_ABI, signer);
};


// Upload file record to BlockDAG with real-time monitoring
export const uploadFileToBlockchain = async (fileHash, ipfsCID, receiverAddress) => {
  try {
    updateBlockchainStatus({ 
      isProcessing: true, 
      currentTx: null,
      error: null 
    });
    
    // Check if connected to BlockDAG network
    const isBlockDAG = await isBlockDAGNetwork();
    if (!isBlockDAG) {
      console.log('Switching to BlockDAG network...');
      await switchToBlockDAG();
    }
    
              // Check if contract address is set
              if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
                throw new Error('Contract not deployed. Please deploy the VaultifyChain contract to BlockDAG network.');
              }
    
    const contract = await getContract();
    
    updateBlockchainStatus({ 
      currentTx: 'pending...',
      isProcessing: true 
    });
    
    const tx = await contract.uploadFile(fileHash, ipfsCID, receiverAddress);
    
    updateBlockchainStatus({ 
      currentTx: tx.hash,
      isProcessing: true 
    });
    
    await tx.wait();
    
    updateBlockchainStatus({ 
      isProcessing: false,
      currentTx: tx.hash
    });
    
    return {
      txHash: tx.hash,
      success: true,
      network: 'BlockDAG'
    };
  } catch (error) {
    console.error('BlockDAG upload failed:', error);
    updateBlockchainStatus({ 
      isProcessing: false,
      error: error.message,
      currentTx: null
    });
    
    throw error;
  }
};

// Log file access
export const logFileAccess = async (fileHash) => {
  try {
              // Check if contract address is set
              if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
                throw new Error('Contract not deployed. Please deploy the VaultifyChain contract to BlockDAG network.');
              }
    
    const contract = await getContract();
    
    const tx = await contract.logAccess(fileHash);
    await tx.wait();
    
    return {
      txHash: tx.hash,
      success: true
    };
  } catch (error) {
    console.error('Access logging failed:', error);
    throw error;
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

// Get audit logs for a user from BlockDAG
export const getAuditLogs = async (userAddress) => {
  try {
              // Check if contract address is set
              if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
                throw new Error('Contract not deployed. Please deploy the VaultifyChain contract to BlockDAG network.');
              }
    
    const contract = await getContract();
    
    // Get FileUploaded events
    const uploadFilter = contract.filters.FileUploaded(null, userAddress, null);
    const uploadEvents = await contract.queryFilter(uploadFilter);
    
    // Get FileAccessed events
    const accessFilter = contract.filters.FileAccessed(null, userAddress);
    const accessEvents = await contract.queryFilter(accessFilter);
    
    // Get UserAuthorized events
    const authFilter = contract.filters.UserAuthorized(null, userAddress);
    const authEvents = await contract.queryFilter(authFilter);
    
    // Get UserDeauthorized events
    const deauthFilter = contract.filters.UserDeauthorized(null, userAddress);
    const deauthEvents = await contract.queryFilter(deauthFilter);
    
    // Combine and sort events
    const allEvents = [...uploadEvents, ...accessEvents, ...authEvents, ...deauthEvents]
      .map(event => ({
        type: event.event,
        fileHash: event.args[0],
        user: event.args[1],
        timestamp: new Date(Number(event.args[2]) * 1000),
        txHash: event.transactionHash,
        network: 'BlockDAG'
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return allEvents;
  } catch (error) {
    console.error('Failed to get audit logs from BlockDAG:', error);
    throw error;
  }
};

// BlockDAG-specific functions for user authorization
export const addAuthorizedUser = async (fileHash, userAddress) => {
  try {
    const contract = await getContract();
    const tx = await contract.addAuthorizedUser(fileHash, userAddress);
    await tx.wait();
    
    return {
      txHash: tx.hash,
      success: true,
      network: 'BlockDAG'
    };
  } catch (error) {
    console.error('Failed to add authorized user on BlockDAG:', error);
    throw error;
  }
};

export const removeAuthorizedUser = async (fileHash, userAddress) => {
  try {
    const contract = await getContract();
    const tx = await contract.removeAuthorizedUser(fileHash, userAddress);
    await tx.wait();
    
    return {
      txHash: tx.hash,
      success: true,
      network: 'BlockDAG'
    };
  } catch (error) {
    console.error('Failed to remove authorized user on BlockDAG:', error);
    throw error;
  }
};

export const getFileAccessLogs = async (fileHash) => {
  try {
    const contract = await getContract();
    const logs = await contract.getFileAccessLogs(fileHash);
    
    return {
      users: logs[0],
      timestamps: logs[1],
      network: 'BlockDAG'
    };
  } catch (error) {
    console.error('Failed to get file access logs from BlockDAG:', error);
    throw error;
  }
};
