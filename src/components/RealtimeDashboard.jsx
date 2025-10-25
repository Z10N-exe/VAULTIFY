import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Globe, 
  Database, 
  Shield, 
  Upload, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Zap,
  FileText,
  Lock,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { addStatusListener, getUploadStatus } from '../utils/ipfs';
import { addBlockchainListener, getBlockchainStatus } from '../utils/blockchain';

const RealtimeDashboard = () => {
  const { files, auditLogs } = useStore();
  const [uploadStatus, setUploadStatus] = useState(getUploadStatus());
  const [blockchainStatus, setBlockchainStatus] = useState(getBlockchainStatus());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [liveStats, setLiveStats] = useState({
    totalFiles: files.length,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    lastActivity: new Date(),
    activeUploads: 0,
    blockchainTxs: 0
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

  // Update live stats
  useEffect(() => {
    setLiveStats(prev => ({
      ...prev,
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      lastActivity: new Date(),
      activeUploads: uploadStatus.isUploading ? 1 : 0,
      blockchainTxs: auditLogs.filter(log => log.txHash).length
    }));
  }, [files, uploadStatus, auditLogs]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return 'text-[#C0FFTC]';
      case 'connecting':
      case 'pending':
        return 'text-yellow-400';
      case 'error':
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-white/70';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'connecting':
      case 'pending':
        return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'error':
      case 'disconnected':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-[#C0FFTC] to-[#86efac] bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            Real-time Dashboard
          </motion.h1>
          <p className="text-white/70 text-lg [font-family:'Inter-Regular',Helvetica]">
            Monitor your VaultifyChain activity in real-time
          </p>
        </motion.div>

        {/* Live Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Network Status */}
          <motion.div 
            className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    Network
                  </h3>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                    Connection Status
                  </p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(isOnline ? 'connected' : 'disconnected')}`}>
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${isOnline ? 'bg-[#C0FFTC]' : 'bg-red-400'}`}
              />
              <span className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                {isOnline ? 'All systems operational' : 'Connection issues detected'}
              </span>
            </div>
          </motion.div>

          {/* IPFS Status */}
          <motion.div 
            className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    IPFS
                  </h3>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                    Storage Network
                  </p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(uploadStatus.isUploading ? 'pending' : 'connected')}`}>
                {getStatusIcon(uploadStatus.isUploading ? 'pending' : 'connected')}
                <span className="text-sm font-medium">
                  {uploadStatus.isUploading ? 'Uploading' : 'Ready'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70 [font-family:'Inter-Regular',Helvetica]">Progress</span>
                <span className="text-[#C0FFTC] font-medium">{uploadStatus.progress || 0}%</span>
              </div>
              {uploadStatus.currentStep && (
                <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                  {uploadStatus.currentStep}
                </p>
              )}
            </div>
          </motion.div>

          {/* Blockchain Status */}
          <motion.div 
            className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    Blockchain
                  </h3>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                    BlockDAG Network
                  </p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${getStatusColor(blockchainStatus.isConnected ? 'connected' : 'disconnected')}`}>
                {getStatusIcon(blockchainStatus.isConnected ? 'connected' : 'disconnected')}
                <span className="text-sm font-medium">
                  {blockchainStatus.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70 [font-family:'Inter-Regular',Helvetica]">Transactions</span>
                <span className="text-[#C0FFTC] font-medium">{liveStats.blockchainTxs}</span>
              </div>
              <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                {blockchainStatus.currentStep || 'Monitoring network...'}
              </p>
            </div>
          </motion.div>

          {/* Security Status */}
          <motion.div 
            className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    Security
                  </h3>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                    Encryption Status
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[#C0FFTC]">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70 [font-family:'Inter-Regular',Helvetica]">Files Encrypted</span>
                <span className="text-[#C0FFTC] font-medium">{liveStats.totalFiles}</span>
              </div>
              <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                AES-256 encryption enabled
              </p>
            </div>
          </motion.div>
        </div>

        {/* Live Statistics */}
        <motion.div 
          className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 mb-8 vaultify-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
              Live Statistics
            </h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#C0FFTC] border-t-transparent rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="text-center p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl border border-[#C0FFTC]/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-black" />
              </div>
              <motion.div 
                className="text-3xl font-bold text-white mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {liveStats.totalFiles}
              </motion.div>
              <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">Total Files</p>
            </motion.div>

            <motion.div 
              className="text-center p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl border border-[#C0FFTC]/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-black" />
              </div>
              <motion.div 
                className="text-3xl font-bold text-white mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                {formatFileSize(liveStats.totalSize)}
              </motion.div>
              <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">Storage Used</p>
            </motion.div>

            <motion.div 
              className="text-center p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl border border-[#C0FFTC]/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <motion.div 
                className="text-3xl font-bold text-white mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                {auditLogs.length}
              </motion.div>
              <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">Total Activities</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
              Recent Activity
            </h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#C0FFTC] border-t-transparent rounded-full"
            />
          </div>

          <div className="space-y-4">
            {auditLogs.slice(-5).reverse().map((log, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-4 bg-[#C0FFTC]/5 backdrop-blur-sm rounded-lg border border-[#C0FFTC]/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-full flex items-center justify-center">
                  {log.type === 'FileUploaded' ? <Upload className="w-5 h-5 text-black" /> :
                   log.type === 'FileDownloaded' ? <Download className="w-5 h-5 text-black" /> :
                   log.type === 'FileShared' ? <Share2 className="w-5 h-5 text-black" /> :
                   <Eye className="w-5 h-5 text-black" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium [font-family:'Inter-SemiBold',Helvetica]">
                    {log.type.replace('File', '')} - {log.fileName || 'Unknown File'}
                  </p>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-[#C0FFTC] text-sm font-medium">
                  {log.user?.substring(0, 6)}...{log.user?.substring(-4)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;