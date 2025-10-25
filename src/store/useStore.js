import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
        files: [...state.files, file],
        // Also add to audit log
        auditLogs: [...state.auditLogs, {
          type: 'FileUploaded',
          fileHash: file.hash,
          fileName: file.name,
          user: state.walletAddress,
          timestamp: new Date(),
          txHash: file.txHash || `0x${Math.random().toString(16).substring(2, 66)}`
        }]
      })),
      
      addSharedFile: (file) => set((state) => ({ 
        sharedFiles: [...state.sharedFiles, file],
        // Also add to audit log
        auditLogs: [...state.auditLogs, {
          type: 'FileShared',
          fileHash: file.hash,
          fileName: file.name,
          user: state.walletAddress,
          timestamp: new Date(),
          txHash: `0x${Math.random().toString(16).substring(2, 66)}`
        }]
      })),
      
      addAuditLog: (log) => set((state) => ({ 
        auditLogs: [...state.auditLogs, log] 
      })),
      
      removeFile: (fileId) => set((state) => ({
        files: state.files.filter(file => file.id !== fileId),
        // Also add to audit log
        auditLogs: [...state.auditLogs, {
          type: 'FileDeleted',
          fileId: fileId,
          user: state.walletAddress,
          timestamp: new Date(),
          txHash: `0x${Math.random().toString(16).substring(2, 66)}`
        }]
      })),

      // File access logging
      logFileAccess: (fileId, action) => set((state) => {
        const file = state.files.find(f => f.id === fileId);
        return {
          auditLogs: [...state.auditLogs, {
            type: 'FileAccessed',
            fileHash: file?.hash,
            fileName: file?.name,
            action: action, // 'download', 'view', 'share'
            user: state.walletAddress,
            timestamp: new Date(),
            txHash: `0x${Math.random().toString(16).substring(2, 66)}`
          }]
        };
      }),
      
      setCurrentTab: (tab) => set({ currentTab: tab }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Clear all data (for logout)
      clearAllData: () => set({
        files: [],
        sharedFiles: [],
        auditLogs: [],
        walletAddress: null,
        isConnected: false,
        chainId: null,
        error: null
      }),
    }),
    {
      name: 'vaultifychain-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        files: state.files,
        sharedFiles: state.sharedFiles,
        auditLogs: state.auditLogs,
        walletAddress: state.walletAddress,
        isConnected: state.isConnected
      }),
    }
  )
);
