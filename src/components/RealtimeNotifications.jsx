import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Upload, 
  Download, 
  Share2, 
  Database,
  Globe,
  Shield,
  X
} from 'lucide-react';
import { addStatusListener, getUploadStatus } from '../utils/ipfs';
import { addBlockchainListener, getBlockchainStatus } from '../utils/blockchain';

const RealtimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(getUploadStatus());
  const [blockchainStatus, setBlockchainStatus] = useState(getBlockchainStatus());

  // Listen to real-time status updates
  useEffect(() => {
    const removeUploadListener = addStatusListener(setUploadStatus);
    const removeBlockchainListener = addBlockchainListener(setBlockchainStatus);
    
    return () => {
      removeUploadListener();
      removeBlockchainListener();
    };
  }, []);

  // Generate notifications based on status changes
  useEffect(() => {
    const newNotifications = [];

    // Upload status notifications
    if (uploadStatus.isUploading && uploadStatus.progress > 0) {
      newNotifications.push({
        id: `upload-${Date.now()}`,
        type: 'info',
        title: 'File Upload Progress',
        message: `${uploadStatus.progress}% - ${uploadStatus.currentStep}`,
        icon: Upload,
        timestamp: new Date(),
        autoClose: false
      });
    }

    if (uploadStatus.error) {
      newNotifications.push({
        id: `upload-error-${Date.now()}`,
        type: 'error',
        title: 'Upload Failed',
        message: uploadStatus.error,
        icon: AlertCircle,
        timestamp: new Date(),
        autoClose: true
      });
    }

    if (uploadStatus.progress === 100 && !uploadStatus.isUploading) {
      newNotifications.push({
        id: `upload-success-${Date.now()}`,
        type: 'success',
        title: 'Upload Complete',
        message: 'File successfully uploaded to IPFS',
        icon: CheckCircle,
        timestamp: new Date(),
        autoClose: true
      });
    }

    // Blockchain status notifications
    if (blockchainStatus.isProcessing && blockchainStatus.currentTx) {
      newNotifications.push({
        id: `blockchain-${Date.now()}`,
        type: 'info',
        title: 'Blockchain Transaction',
        message: `Processing transaction: ${blockchainStatus.currentTx.slice(0, 8)}...`,
        icon: Database,
        timestamp: new Date(),
        autoClose: false
      });
    }

    if (blockchainStatus.error) {
      newNotifications.push({
        id: `blockchain-error-${Date.now()}`,
        type: 'error',
        title: 'Blockchain Error',
        message: blockchainStatus.error,
        icon: AlertCircle,
        timestamp: new Date(),
        autoClose: true
      });
    }

    if (!blockchainStatus.isProcessing && blockchainStatus.currentTx) {
      newNotifications.push({
        id: `blockchain-success-${Date.now()}`,
        type: 'success',
        title: 'Transaction Confirmed',
        message: 'File record successfully added to blockchain',
        icon: CheckCircle,
        timestamp: new Date(),
        autoClose: true
      });
    }

    // Add new notifications
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep only last 10
    }
  }, [uploadStatus, blockchainStatus]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'info':
        return 'border-blue-500 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  // Auto-remove notifications
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.filter(notif => {
          if (notif.autoClose) {
            const age = Date.now() - notif.timestamp.getTime();
            return age < 5000; // Remove after 5 seconds
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-sm ${getNotificationColor(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <notification.icon className="w-5 h-5" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs mt-1">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress indicator for uploads */}
            {notification.title === 'File Upload Progress' && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                <motion.div 
                  className="bg-blue-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadStatus.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeNotifications;
