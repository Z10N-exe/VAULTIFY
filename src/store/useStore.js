import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Wallet state
      walletAddress: null,
      isConnected: false,
      chainId: null,
      
      // File state
      files: [],
      sharedFiles: [],
      auditLogs: [],
      
      // UI state
      currentTab: 'dashboard',
      isLoading: false,
      error: null,
      
      // Actions
      setWallet: (address, chainId) => set({ 
        walletAddress: address, 
        isConnected: !!address,
        chainId 
      }),
      
      disconnectWallet: () => set({ 
        walletAddress: null, 
        isConnected: false, 
        chainId: null 
      }),
      
      addFile: (file) => set((state) => ({ 
        files: [...state.files, file] 
      })),
      
      addSharedFile: (file) => set((state) => ({ 
        sharedFiles: [...state.sharedFiles, file] 
      })),
      
      addAuditLog: (log) => set((state) => ({ 
        auditLogs: [...state.auditLogs, log] 
      })),
      
      setCurrentTab: (tab) => set({ currentTab: tab }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'vaultifychain-storage',
      partialize: (state) => ({ 
        files: state.files,
        sharedFiles: state.sharedFiles,
        auditLogs: state.auditLogs 
      }),
    }
  )
);
