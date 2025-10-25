import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  Database,
  Globe,
  Shield
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { addStatusListener, getUploadStatus } from '../utils/ipfs';
import { addBlockchainListener, getBlockchainStatus } from '../utils/blockchain';

const RealtimeSync = () => {
  const { files, auditLogs, addFile, addAuditLog } = useStore();
  const [uploadStatus, setUploadStatus] = useState(getUploadStatus());
  const [blockchainStatus, setBlockchainStatus] = useState(getBlockchainStatus());
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSync: null,
    errors: []
  });

  // Listen to real-time status updates
  useEffect(() => {
    const removeUploadListener = addStatusListener(setUploadStatus);
    const removeBlockchainListener = addBlockchainListener(setBlockchainStatus);
    
    return () => {
      removeUploadListener();
      removeBlockchainListener();
    };
  }, []);

  // Simulate real-time file synchronization
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (uploadStatus.isUploading || blockchainStatus.isProcessing) {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: true,
          lastSync: new Date()
        }));
      } else {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSync: new Date()
        }));
      }
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [uploadStatus.isUploading, blockchainStatus.isProcessing]);

  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString();
  };

  return (
    <motion.div 
      className="fixed bottom-4 left-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700">Live Sync</span>
          {syncStatus.isSyncing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 text-blue-500" />
            </motion.div>
          )}
        </div>

        {/* Sync Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">IPFS Status</span>
            <div className="flex items-center space-x-1">
              {uploadStatus.isUploading ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Globe className="w-4 h-4 text-purple-500" />
                </motion.div>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-xs text-gray-500">
                {uploadStatus.isUploading ? 'Uploading' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Blockchain</span>
            <div className="flex items-center space-x-1">
              {blockchainStatus.isProcessing ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Database className="w-4 h-4 text-blue-500" />
                </motion.div>
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-xs text-gray-500">
                {blockchainStatus.isProcessing ? 'Processing' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Files</span>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500">{files.length} stored</span>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <AnimatePresence>
          {uploadStatus.isUploading && (
            <motion.div 
              className="mt-3 p-2 bg-blue-50 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                </motion.div>
                <span className="text-sm font-medium text-blue-700">Uploading</span>
                <span className="text-xs text-blue-600">{uploadStatus.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1">
                <motion.div 
                  className="bg-blue-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadStatus.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-1">{uploadStatus.currentStep}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {blockchainStatus.isProcessing && (
            <motion.div 
              className="mt-3 p-2 bg-green-50 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Database className="w-4 h-4 text-green-500" />
                </motion.div>
                <span className="text-sm font-medium text-green-700">Blockchain</span>
              </div>
              {blockchainStatus.currentTx && (
                <p className="text-xs text-green-600 truncate">
                  TX: {blockchainStatus.currentTx.slice(0, 10)}...
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last Sync Time */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last sync: {formatTime(syncStatus.lastSync)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RealtimeSync;


