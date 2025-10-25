import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Globe, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { addStatusListener, getUploadStatus } from '../utils/ipfs';
import { addBlockchainListener, getBlockchainStatus, startBlockchainMonitoring } from '../utils/blockchain';

const RealtimeStatus = () => {
  const [uploadStatus, setUploadStatus] = useState(getUploadStatus());
  const [blockchainStatus, setBlockchainStatus] = useState(getBlockchainStatus());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Start blockchain monitoring
    startBlockchainMonitoring();

    // Listen to upload status changes
    const removeUploadListener = addStatusListener(setUploadStatus);
    
    // Listen to blockchain status changes
    const removeBlockchainListener = addBlockchainListener(setBlockchainStatus);

    // Listen to online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      removeUploadListener();
      removeBlockchainListener();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusIcon = (status, isActive) => {
    if (status.error) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (isActive) return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusColor = (status, isActive) => {
    if (status.error) return 'text-red-500';
    if (isActive) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <motion.div 
      className="fixed top-4 right-4 z-50 space-y-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Network Status */}
      <motion.div 
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200"
        whileHover={{ scale: 1.02 }}
      >
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </motion.div>

      {/* IPFS Status */}
      <motion.div 
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200"
        whileHover={{ scale: 1.02 }}
      >
        <Globe className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-gray-700">IPFS</span>
        {getStatusIcon(uploadStatus, uploadStatus.isUploading)}
        {uploadStatus.isUploading && (
          <span className="text-xs text-blue-600">{uploadStatus.progress}%</span>
        )}
      </motion.div>

      {/* Blockchain Status */}
      <motion.div 
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200"
        whileHover={{ scale: 1.02 }}
      >
        <Database className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-700">Blockchain</span>
        {getStatusIcon(blockchainStatus, blockchainStatus.isProcessing)}
        {blockchainStatus.currentTx && (
          <span className="text-xs text-blue-600 truncate max-w-20">
            {blockchainStatus.currentTx.slice(0, 8)}...
          </span>
        )}
      </motion.div>

      {/* Live Activity Indicator */}
      <motion.div 
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200"
        whileHover={{ scale: 1.02 }}
      >
        <Activity className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">Live</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 bg-orange-500 rounded-full"
        />
      </motion.div>

      {/* Upload Progress (when active) */}
      <AnimatePresence>
        {uploadStatus.isUploading && (
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-sm font-medium text-gray-700">Uploading</span>
              <span className="text-xs text-blue-600">{uploadStatus.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div 
                className="bg-blue-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadStatus.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{uploadStatus.currentStep}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blockchain Transaction (when active) */}
      <AnimatePresence>
        {blockchainStatus.isProcessing && (
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-sm font-medium text-gray-700">Processing</span>
            </div>
            {blockchainStatus.currentTx && (
              <p className="text-xs text-gray-600 truncate">
                TX: {blockchainStatus.currentTx}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Messages */}
      <AnimatePresence>
        {(uploadStatus.error || blockchainStatus.error) && (
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Error</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              {uploadStatus.error || blockchainStatus.error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealtimeStatus;
