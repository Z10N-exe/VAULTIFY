# 🚀 BlockDAG Deployment Guide

## Prerequisites

1. **BlockDAG Testnet Wallet**: You need a wallet with BDAG tokens on BlockDAG testnet
2. **Private Key**: Your wallet's private key for deployment
3. **BlockDAG Testnet Access**: Make sure you can access BlockDAG testnet

## Step 1: Get BlockDAG Testnet Tokens

1. Visit [BlockDAG Testnet Faucet](https://faucet-testnet.blockdag.network)
2. Connect your wallet
3. Request testnet BDAG tokens

## Step 2: Configure Environment

Create a `.env` file in the project root with:

```env
# BlockDAG Network Configuration
VITE_BLOCKDAG_RPC_URL=https://relay.awakening.bdagscan.com/
VITE_BLOCKDAG_CHAIN_ID=1043
VITE_BLOCKDAG_EXPLORER_URL=https://explorer-testnet.blockdag.network

# Wallet Configuration (REPLACE WITH YOUR PRIVATE KEY)
PRIVATE_KEY=your_actual_private_key_here

# Contract Configuration (will be updated after deployment)
VITE_CONTRACT_ADDRESS=

# IPFS Configuration
VITE_NFT_STORAGE_TOKEN=8343b323.441890267f0644628ddecbd69421a423

# Development Configuration
NODE_ENV=development
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=VaultifyChain
```

## Step 3: Deploy to BlockDAG Testnet

Run the deployment command:

```bash
npx hardhat run scripts/deploy-blockdag.cjs --network blockdagTestnet
```

## Step 4: Update Contract Address

After successful deployment, copy the contract address and update your `.env` file:

```env
VITE_CONTRACT_ADDRESS=0x[deployed_contract_address]
```

## Step 5: Verify Deployment

1. Visit [BlockDAG Testnet Explorer](https://explorer-testnet.blockdag.network)
2. Search for your contract address
3. Verify the contract is deployed and has the correct code

## Step 6: Test the Application

1. Start the development server: `npm run dev`
2. Connect MetaMask to BlockDAG Testnet
3. Use the "Test Upload System" button to verify everything works
4. Try uploading a file

## Network Configuration for MetaMask

If MetaMask doesn't automatically switch to BlockDAG Testnet, add it manually:

- **Network Name**: BlockDAG Testnet
- **RPC URL**: https://relay.awakening.bdagscan.com/
- **Chain ID**: 1043
- **Currency Symbol**: BDAG
- **Block Explorer**: https://explorer-testnet.blockdag.network

## Troubleshooting

### Common Issues:

1. **"Insufficient funds"**: Get more BDAG tokens from the faucet
2. **"Network not found"**: Make sure you're connected to BlockDAG Testnet
3. **"Contract not found"**: Verify the contract address is correct
4. **"Transaction failed"**: Check gas settings and network connection

### Getting Help:

- Check the console for detailed error messages
- Use the "Test Upload System" button to debug issues
- Verify all environment variables are set correctly

## Security Notes

⚠️ **IMPORTANT**: Never commit your private key to version control. The `.env` file should be in `.gitignore`.

✅ **Safe Practice**: Use a dedicated wallet for testing, not your main wallet.

