# VaultifyChain Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the environment template and configure your settings:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Web3.Storage API Token (required)
REACT_APP_WEB3_STORAGE_TOKEN=your_token_here

# Smart Contract Address (deploy first)
REACT_APP_CONTRACT_ADDRESS=0x...

# Network Configuration
REACT_APP_NETWORK_ID=1
REACT_APP_RPC_URL=https://mainnet.infura.io/v3/your_key
```

### 3. Get Web3.Storage Token
1. Visit [web3.storage](https://web3.storage/)
2. Sign up for a free account
3. Create a new API token
4. Add it to your `.env` file

### 4. Deploy Smart Contract
1. Use Remix IDE or Hardhat to deploy the contract
2. Copy the deployed contract address to `.env`
3. Update the contract ABI if needed

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Features Implemented

### ✅ Core Functionality
- **Wallet Connection**: MetaMask integration with account switching
- **File Encryption**: AES-256 encryption before upload
- **IPFS Storage**: Decentralized file storage via Web3.Storage
- **Blockchain Recording**: File hashes and metadata on-chain
- **Access Control**: Wallet-based file access permissions
- **Audit Logs**: Complete blockchain-verified activity tracking

### ✅ User Interface
- **Landing Page**: Beautiful marketing site with wallet connection
- **Dashboard**: Overview with file statistics and quick actions
- **Upload Interface**: Drag-and-drop file upload with encryption
- **File Management**: View, access, and manage uploaded files
- **Audit Viewer**: Searchable and filterable blockchain audit logs

### ✅ Security Features
- **End-to-End Encryption**: Files encrypted locally before upload
- **Zero-Trust Architecture**: No central authority can access files
- **Blockchain Verification**: Immutable proof of file existence and access
- **Access Logging**: Every file access recorded on-chain

## 🏗️ Architecture

```
Frontend (React + Vite)
├── Wallet Connection (MetaMask)
├── File Encryption (CryptoJS AES-256)
├── IPFS Upload (Web3.Storage)
└── Blockchain Recording (Ethers.js)

Smart Contract (Solidity)
├── File Records Storage
├── Access Control
├── Event Logging
└── Audit Trail
```

## 📱 Usage Flow

1. **Connect Wallet**: User connects MetaMask wallet
2. **Upload File**: Select file, enter receiver address and password
3. **Encryption**: File encrypted locally with AES-256
4. **IPFS Upload**: Encrypted file stored on IPFS
5. **Blockchain Record**: File hash and metadata recorded on-chain
6. **Access Control**: Only authorized wallets can decrypt files
7. **Audit Trail**: All activities logged on blockchain

## 🔒 Security Model

- **Local Encryption**: Files encrypted in browser before upload
- **Decentralized Storage**: Files stored on IPFS, not centralized servers
- **Blockchain Proof**: File existence and access verified on-chain
- **Access Control**: Only designated wallets can decrypt files
- **Audit Logs**: Immutable record of all file activities

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Smart Contract Deployment
1. Deploy to your preferred network (Ethereum, Polygon, etc.)
2. Update contract address in environment variables
3. Verify contract on block explorer

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── store/              # State management
└── contracts/          # Smart contracts
```

### Key Files
- `src/components/Dashboard.js` - Main dashboard interface
- `src/components/UploadTab.js` - File upload functionality
- `src/components/FilesTab.js` - File management
- `src/components/AuditTab.js` - Audit log viewer
- `src/utils/encryption.js` - File encryption utilities
- `src/utils/ipfs.js` - IPFS integration
- `src/utils/blockchain.js` - Blockchain interactions
- `src/contracts/VaultifyChain.sol` - Smart contract

## 🔧 Troubleshooting

### Common Issues

1. **Web3.Storage Token**: Make sure you have a valid token
2. **MetaMask Connection**: Ensure MetaMask is installed and unlocked
3. **Network Issues**: Check your RPC URL and network configuration
4. **Contract Address**: Verify the contract is deployed and address is correct

### Error Messages
- "Web3.Storage token not found" → Add your token to `.env`
- "MetaMask not detected" → Install MetaMask browser extension
- "Failed to connect wallet" → Check MetaMask is unlocked
- "Contract not found" → Deploy contract and update address

## 📚 Next Steps

1. **Deploy Smart Contract**: Deploy to mainnet or testnet
2. **Configure Environment**: Add your API keys and contract address
3. **Test Functionality**: Upload files and verify blockchain records
4. **Customize UI**: Modify styling and branding as needed
5. **Add Features**: Implement additional functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

