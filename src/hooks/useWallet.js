import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useStore } from '../store/useStore';

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { 
    walletAddress, 
    isConnected, 
    chainId, 
    setWallet, 
    disconnectWallet 
  } = useStore();

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            setWallet(accounts[0], Number(network.chainId));
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, [setWallet]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(accounts[0], chainId);
        }
      };

      const handleChainChanged = (chainId) => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [chainId, setWallet, disconnectWallet]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Get network info
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      setWallet(accounts[0], Number(network.chainId));
      
      return {
        address: accounts[0],
        chainId: Number(network.chainId)
      };
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request.');
      }
      throw new Error(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    disconnectWallet();
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (error) {
      if (error.code === 4902) {
        throw new Error('Please add the network to MetaMask first.');
      }
      throw new Error(`Failed to switch network: ${error.message}`);
    }
  };

  return {
    walletAddress,
    isConnected,
    chainId,
    isConnecting,
    connectWallet,
    disconnect,
    switchNetwork
  };
};
