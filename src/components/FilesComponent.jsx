import React, { useState, useEffect } from 'react';
import { Eye, Download, Share2, Trash2, FileText, Lock, Calendar, User, Hash, Key, Database, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { decryptFile } from '../utils/encryption';
import { retrieveFromIPFS } from '../utils/ipfs';
import { motion, AnimatePresence } from 'framer-motion';

const FilesComponent = ({ files, onFileDeleted, onFileShared, onFileDownloaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAddress, setShareAddress] = useState('');
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [decryptKey, setDecryptKey] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadFile = (content, fileName, fileType) => {
    try {
      console.log('📥 Downloading file:', fileName);
      const blob = new Blob([content], { type: fileType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('❌ Download failed:', error);
      toast.error('Download failed: ' + error.message);
    }
  };

  const handleDownload = async (file) => {
    console.log('📥 Download requested for file:', file.name);
    console.log('🔑 Stored encryption key:', file.encryptionKey);
    
    // If we have the original content stored, use it directly
    if (file.originalContent) {
      console.log('✅ Using stored original content');
      downloadFile(file.originalContent, file.name, file.type);
      onFileDownloaded && onFileDownloaded(file);
      return;
    }
    
    // If we have the encryption key stored, use it for decryption
    if (file.encryptionKey) {
      console.log('🔑 Using stored encryption key');
      setDecryptKey(file.encryptionKey);
      setSelectedFile(file);
      setShowDecryptModal(true);
      return;
    }
    
    // Otherwise, ask user for the key
    console.log('❓ No stored key, asking user for decryption key');
    setSelectedFile(file);
    setShowDecryptModal(true);
  };

  const handleRealDownload = async () => {
    if (!selectedFile || !decryptKey) {
      toast.error('Please provide the decryption key');
      return;
    }

    console.log('🔓 Starting decryption process...');
    console.log('📁 File:', selectedFile.name);
    console.log('🔑 Key provided:', !!decryptKey);
    
    setIsDownloading(true);

    try {
      // Step 1: Retrieve encrypted file from IPFS
      console.log('📤 Retrieving file from IPFS...');
      toast.loading('Retrieving file from IPFS...');
      const encryptedFile = await retrieveFromIPFS(selectedFile.ipfsCid);
      
      // Step 2: Read encrypted content
      console.log('📖 Reading encrypted content...');
      const encryptedContent = await encryptedFile.text();
      console.log('✅ Encrypted content retrieved, length:', encryptedContent.length);
      
      // Step 3: Decrypt file
      console.log('🔓 Decrypting file...');
      toast.loading('Decrypting file...');
      const decryptedContent = decryptFile(encryptedContent, decryptKey);
      console.log('✅ File decrypted successfully, length:', decryptedContent.length);
      
      // Step 4: Create download
      console.log('📥 Creating download...');
      downloadFile(decryptedContent, selectedFile.name, selectedFile.type);

      setShowDecryptModal(false);
      setDecryptKey('');
      setSelectedFile(null);
      setIsDownloading(false);
      
      // Log the download event
      if (onFileDownloaded) {
        onFileDownloaded(selectedFile.id);
      }
    } catch (error) {
      console.error('❌ Download failed:', error);
      setIsDownloading(false);
      toast.error(`Download failed: ${error.message}`);
    }
  };

  const handleShare = (file) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const handleShareFile = () => {
    if (!shareAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }
    
    // Here you would implement the actual sharing logic
    toast.success(`File shared with ${shareAddress}`);
    setShowShareModal(false);
    setShareAddress('');
    setSelectedFile(null);
    
    if (onFileShared) {
      onFileShared(selectedFile.id, shareAddress);
    }
  };

  const handleDelete = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      onFileDeleted && onFileDeleted(fileId);
      toast.success('File deleted successfully');
    }
  };

  return (
    <>
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div 
          className="bg-black backdrop-blur-xl rounded-3xl p-8 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center"
                whileHover={{ rotate: 5 }}
              >
                <FileText className="w-8 h-8 text-black" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                  My Files
                </h1>
                <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">
                  {files.length} files stored securely
                </p>
              </div>
            </div>
          </div>

          {/* Files Grid */}
          {files.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-24 h-24 bg-[#C0FFTC]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-12 h-12 text-[#C0FFTC]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 [font-family:'Inter-SemiBold',Helvetica]">
                No files yet
              </h3>
              <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">
                Upload your first file to get started
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  className="bg-black rounded-2xl p-6 border-2 border-[#C0FFTC] hover:border-[#C0FFTC] hover:shadow-[#C0FFTC]/40 hover:bg-[#C0FFTC]/5 transition-all duration-300 hover:shadow-xl vaultify-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg [font-family:'Inter-SemiBold',Helvetica] truncate">
                          {file.name}
                        </h3>
                        <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-white/70 hover:text-[#C0FFTC] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare(file)}
                        className="p-2 text-white/70 hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-white/70 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-white/70 [font-family:'Inter-Regular',Helvetica]">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(file.uploadDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70 [font-family:'Inter-Regular',Helvetica]">
                      <Hash className="w-4 h-4" />
                      <span className="truncate">{file.hash.substring(0, 16)}...</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70 [font-family:'Inter-Regular',Helvetica]">
                      <Globe className="w-4 h-4" />
                      <span className="truncate">{file.ipfsCid.substring(0, 16)}...</span>
                    </div>
                    {file.encryptionKey && (
                      <div className="flex items-center space-x-2 text-sm text-[#C0FFTC] [font-family:'Inter-Regular',Helvetica]">
                        <Key className="w-4 h-4" />
                        <span>Key stored</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      file.status === 'uploaded' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {file.status}
                    </span>
                    <span className="text-xs text-white/50 [font-family:'Inter-Regular',Helvetica]">
                      {file.receiverAddress === 'Public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>

    {/* Share Modal */}
    <AnimatePresence>
      {showShareModal && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-black rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/40 vaultify-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                Share File
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2 [font-family:'Inter-SemiBold',Helvetica]">
                Wallet Address
              </label>
              <input
                type="text"
                value={shareAddress}
                onChange={(e) => setShareAddress(e.target.value)}
                placeholder="Enter wallet address to share with"
                className="w-full px-4 py-3 bg-black border-2 border-[#C0FFTC] rounded-lg focus:ring-2 focus:ring-[#C0FFTC] focus:border-[#C0FFTC] focus:bg-[#C0FFTC]/5 text-white placeholder-white/80 [font-family:'Inter-Regular',Helvetica] shadow-[#C0FFTC]/20 vaultify-input"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-3 border-2 border-[#C0FFTC] text-white rounded-lg hover:bg-[#C0FFTC]/10 transition-colors [font-family:'Inter-SemiBold',Helvetica]"
              >
                Cancel
              </button>
              <button
                onClick={handleShareFile}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black rounded-lg hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 font-semibold [font-family:'Inter-SemiBold',Helvetica]"
              >
                Share
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Decrypt Modal */}
    <AnimatePresence>
      {showDecryptModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-black rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/40 vaultify-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                Decrypt File
              </h3>
              <button
                onClick={() => {
                  setShowDecryptModal(false);
                  setDecryptKey('');
                  setSelectedFile(null);
                }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 p-4 bg-[#C0FFTC]/10 rounded-lg mb-4">
                <FileText className="w-8 h-8 text-[#C0FFTC]" />
                <div>
                  <p className="font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    {selectedFile?.name}
                  </p>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">
                    {selectedFile && formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2 [font-family:'Inter-SemiBold',Helvetica]">
                Encryption Key
                {selectedFile?.encryptionKey && (
                  <span className="text-green-400 text-xs ml-2">(Key stored automatically)</span>
                )}
              </label>
              <input
                type="password"
                value={decryptKey}
                onChange={(e) => setDecryptKey(e.target.value)}
                placeholder={selectedFile?.encryptionKey ? "Key is pre-filled from storage" : "Enter the encryption key used to encrypt this file"}
                className="w-full px-4 py-3 bg-black border-2 border-[#C0FFTC] rounded-lg focus:ring-2 focus:ring-[#C0FFTC] focus:border-[#C0FFTC] focus:bg-[#C0FFTC]/5 text-white placeholder-white/80 [font-family:'Inter-Regular',Helvetica] shadow-[#C0FFTC]/20 vaultify-input"
              />
              <p className="text-sm text-white/70 mt-2 [font-family:'Inter-Regular',Helvetica]">
                {selectedFile?.encryptionKey 
                  ? "The encryption key has been automatically retrieved from storage."
                  : "This key was used to encrypt the file when it was uploaded."
                }
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDecryptModal(false);
                  setDecryptKey('');
                  setSelectedFile(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-[#C0FFTC] text-white rounded-lg hover:bg-[#C0FFTC]/10 transition-colors [font-family:'Inter-SemiBold',Helvetica]"
              >
                Cancel
              </button>
              <button
                onClick={handleRealDownload}
                disabled={isDownloading || !decryptKey}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black rounded-lg hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold [font-family:'Inter-SemiBold',Helvetica]"
              >
                {isDownloading ? (
                  <>
                    <motion.div 
                      className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Decrypting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default FilesComponent;