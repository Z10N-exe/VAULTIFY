import React, { useState, useEffect } from 'react';
import { Upload, Lock, Shield, FileText, X, CheckCircle, Activity, Globe, Database, Key, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { encryptFile, generateFileHash } from '../utils/encryption';
import { uploadToIPFS, addStatusListener, getUploadStatus } from '../utils/ipfs';
import { uploadFileToBlockchain, addBlockchainListener, getBlockchainStatus } from '../utils/blockchain';
import { motion, AnimatePresence } from 'framer-motion';

const UploadComponent = ({ onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
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

  const handleFileSelect = (event) => {
    console.log('📁 File selection event triggered');
    const file = event.target.files[0];
    console.log('📁 Selected file:', file);
    if (file) {
      setSelectedFile(file);
      setEncryptionKey(''); // Reset encryption key
      console.log('✅ File set in state:', file.name, file.size);
      toast.success(`File selected: ${file.name}`);
    } else {
      console.log('❌ No file selected');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setEncryptionKey('');
    setReceiverAddress('');
  };

  const generateEncryptionKey = () => {
    console.log('🔑 Generating encryption key...');
    const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log('🔑 Generated key:', key);
    setEncryptionKey(key);
    toast.success('Encryption key generated!');
  };


  const handleSimpleUpload = async () => {
    console.log('🔍 Simple upload button clicked!');
    console.log('📁 Selected file:', selectedFile);
    console.log('🔑 Encryption key:', encryptionKey);
    
    if (!selectedFile || !encryptionKey) {
      console.log('❌ Simple upload validation failed - missing file or key');
      toast.error('Please select a file and provide an encryption key');
      return;
    }

    console.log('🚀 Starting simple upload (IPFS only)...');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Read and encrypt file
      console.log('📖 Reading file content...');
      setUploadProgress(30);
      const fileContent = await readFileAsArrayBuffer(selectedFile);
      const fileContentString = new TextDecoder().decode(fileContent);
      console.log('✅ File content read, length:', fileContentString.length);
      
      console.log('🔒 Encrypting file...');
      const encryptedContent = encryptFile(fileContentString, encryptionKey);
      console.log('✅ File encrypted, length:', encryptedContent.length);
      
      // Upload to IPFS only
      console.log('📤 Uploading to IPFS...');
      setUploadProgress(70);
      const ipfsResult = await uploadToIPFS(encryptedContent, selectedFile.name);
      console.log('✅ IPFS upload successful:', ipfsResult);
      
      setUploadProgress(100);

      // Create file record with all necessary data
      const fileRecord = {
        id: Date.now(),
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        hash: generateFileHash(fileContentString),
        ipfsCid: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
        encryptionKey: encryptionKey, // Store the key for future decryption
        receiverAddress: receiverAddress || 'Public',
        uploadDate: new Date(),
        status: 'uploaded',
        txHash: null, // No blockchain transaction
        originalContent: fileContentString // Store original content for easy access
      };

      console.log('💾 File record created:', fileRecord);

      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setEncryptionKey('');
      setReceiverAddress('');

      toast.success('File uploaded to IPFS successfully!');
      onFileUploaded(fileRecord);

    } catch (error) {
      console.error('❌ Simple upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  const handleFullUpload = async () => {
    console.log('🔍 Full upload button clicked!');
    console.log('📁 Selected file:', selectedFile);
    console.log('🔑 Encryption key:', encryptionKey);
    
    if (!selectedFile || !encryptionKey) {
      console.log('❌ Full upload validation failed - missing file or key');
      toast.error('Please select a file and provide an encryption key');
      return;
    }

    console.log('🚀 Starting full upload process...');
    console.log('📁 File:', selectedFile.name, selectedFile.size, 'bytes');
    console.log('🔑 Encryption key length:', encryptionKey.length);
    console.log('🌐 Environment check:');
    console.log('  - NFT Storage Token:', !!import.meta.env.VITE_NFT_STORAGE_TOKEN);
    console.log('  - Contract Address:', import.meta.env.VITE_CONTRACT_ADDRESS);
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Read file content
      console.log('📖 Step 1: Reading file content...');
      setUploadProgress(10);
      const fileContent = await readFileAsArrayBuffer(selectedFile);
      const fileContentString = new TextDecoder().decode(fileContent);
      console.log('✅ File content read, length:', fileContentString.length);
      
      // Step 2: Generate file hash
      console.log('🔐 Step 2: Generating file hash...');
      setUploadProgress(20);
      const fileHash = generateFileHash(fileContentString);
      console.log('✅ File hash generated:', fileHash);
      
      // Step 3: Encrypt file
      console.log('🔒 Step 3: Encrypting file...');
      setUploadProgress(30);
      const encryptedContent = encryptFile(fileContentString, encryptionKey);
      console.log('✅ File encrypted, length:', encryptedContent.length);
      
      // Step 4: Upload to IPFS
      console.log('📤 Step 4: Uploading to IPFS...');
      setUploadProgress(50);
      const ipfsResult = await uploadToIPFS(encryptedContent, selectedFile.name);
      console.log('✅ IPFS upload successful:', ipfsResult);
      
      // Step 5: Upload to blockchain (optional if no contract)
      console.log('⛓️ Step 5: Uploading to blockchain...');
      setUploadProgress(80);
      
      let blockchainResult = null;
      try {
        blockchainResult = await uploadFileToBlockchain(
          fileHash,
          ipfsResult.cid,
          receiverAddress || '0x0000000000000000000000000000000000000000'
        );
        console.log('✅ Blockchain upload successful:', blockchainResult);
      } catch (blockchainError) {
        console.log('⚠️ Blockchain upload failed (continuing without blockchain):', blockchainError.message);
        toast.error('Blockchain upload failed, but file uploaded to IPFS successfully');
      }
      
      setUploadProgress(100);

      // Create file record with real data
      const fileRecord = {
        id: Date.now(),
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        hash: fileHash,
        ipfsCid: ipfsResult.cid,
        ipfsUrl: ipfsResult.url,
        encryptionKey: encryptionKey, // Store the key for future decryption
        receiverAddress: receiverAddress || 'Public',
        uploadDate: new Date(),
        status: 'uploaded',
        txHash: blockchainResult?.txHash || null,
        originalContent: fileContentString // Store original content for easy access
      };

      console.log('💾 File record created:', fileRecord);

      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setEncryptionKey('');
      setReceiverAddress('');

      toast.success('File uploaded and encrypted successfully!');
      onFileUploaded(fileRecord);

    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      setIsUploading(false);
      setUploadProgress(0);
      
      // More specific error messages
      if (error.message.includes('NFT.Storage')) {
        toast.error('IPFS upload failed: Check your NFT.Storage token');
      } else if (error.message.includes('MetaMask')) {
        toast.error('Blockchain upload failed: Check your wallet connection');
      } else if (error.message.includes('encrypt')) {
        toast.error('Encryption failed: Check your encryption key');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div 
          className="bg-black backdrop-blur-xl rounded-3xl p-8 border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30 vaultify-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center"
              whileHover={{ rotate: 5 }}
            >
              <Upload className="w-8 h-8 text-black" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                Secure File Upload
              </h1>
              <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">
                Encrypt and store your files securely on BlockDAG
              </p>
            </div>
          </div>

          {/* File Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">
              Select File to Upload
            </label>
            
            {!selectedFile ? (
              <motion.div 
                className="border-2 border-dashed border-[#C0FFTC] rounded-2xl p-8 text-center hover:border-[#C0FFTC] hover:bg-[#C0FFTC]/10 transition-all duration-300 bg-[#C0FFTC]/5 shadow-[#C0FFTC]/20"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 10 }}
                  >
                    <Upload className="w-10 h-10 text-black" />
                  </motion.div>
                  <div>
                    <p className="text-xl font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">Click to select file</p>
                    <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">or drag and drop</p>
                  </div>
                </label>
              </motion.div>
            ) : (
              <motion.div 
                className="bg-[#C0FFTC]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#C0FFTC]/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                      <FileText className="w-7 h-7 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg [font-family:'Inter-SemiBold',Helvetica]">{selectedFile.name}</p>
                      <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={removeFile}
                    className="p-2 text-white/70 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Encryption Key */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">
              Encryption Key
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={encryptionKey}
                onChange={(e) => {
                  console.log('🔑 Encryption key changed:', e.target.value);
                  setEncryptionKey(e.target.value);
                }}
                placeholder="Enter encryption key or generate one"
                className="flex-1 px-4 py-3 bg-black border-2 border-[#C0FFTC] rounded-xl focus:ring-2 focus:ring-[#C0FFTC] focus:border-[#C0FFTC] focus:bg-[#C0FFTC]/10 text-white placeholder-white/80 [font-family:'Inter-Regular',Helvetica] shadow-[#C0FFTC]/30 hover:shadow-[#C0FFTC]/40 vaultify-input"
              />
              <motion.button
                onClick={generateEncryptionKey}
                className="px-6 py-3 bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black rounded-xl hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 flex items-center space-x-2 font-semibold [font-family:'Inter-SemiBold',Helvetica]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Key className="w-5 h-5" />
                <span>Generate</span>
              </motion.button>
            </div>
          </div>

          {/* Receiver Address */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">
              Receiver Address (Optional)
            </label>
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="Enter wallet address (leave empty for public access)"
              className="w-full px-4 py-3 bg-black border-2 border-[#C0FFTC] rounded-xl focus:ring-2 focus:ring-[#C0FFTC] focus:border-[#C0FFTC] focus:bg-[#C0FFTC]/10 text-white placeholder-white/80 [font-family:'Inter-Regular',Helvetica] shadow-[#C0FFTC]/30 hover:shadow-[#C0FFTC]/40 vaultify-input"
            />
            <p className="text-white/70 mt-2 [font-family:'Inter-Regular',Helvetica]">
              Only this wallet address will be able to decrypt the file
            </p>
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {isUploading && (
              <motion.div 
                className="mb-8 p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-2xl border border-[#C0FFTC]/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold [font-family:'Inter-SemiBold',Helvetica]">
                    Uploading...
                  </span>
                  <span className="text-[#C0FFTC] font-semibold [font-family:'Inter-SemiBold',Helvetica]">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-[#C0FFTC] to-[#86efac] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-4 text-sm text-white/70 [font-family:'Inter-Regular',Helvetica]">
                  {uploadStatus.currentStep}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="space-y-4">

            {/* Simple Upload Button (IPFS only) */}
            <motion.button
              onClick={() => {
                console.log('🟢 Simple upload button clicked!');
                console.log('📁 File selected:', !!selectedFile);
                console.log('🔑 Key provided:', !!encryptionKey);
                console.log('⏳ Is uploading:', isUploading);
                handleSimpleUpload();
              }}
              disabled={isUploading || !encryptionKey}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-3 [font-family:'Inter-SemiBold',Helvetica] shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Database className="w-5 h-5" />
              <span>Upload to IPFS Only</span>
            </motion.button>

            {/* Full Upload Button (IPFS + Blockchain) */}
            <motion.button
              onClick={() => {
                console.log('🟢 Full upload button clicked!');
                console.log('📁 File selected:', !!selectedFile);
                console.log('🔑 Key provided:', !!encryptionKey);
                console.log('⏳ Is uploading:', isUploading);
                handleFullUpload();
              }}
              disabled={isUploading || !encryptionKey}
              className="w-full bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black px-8 py-4 rounded-xl font-bold text-xl hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-3 [font-family:'Inter-SemiBold',Helvetica] shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUploading ? (
                <>
                  <motion.div 
                    className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  <span>Upload & Encrypt</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Security Features */}
          <motion.div 
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="flex items-center space-x-3 p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30"
              whileHover={{ scale: 1.05, shadow: "0 0 20px #C0FFTC" }}
            >
              <CheckCircle className="w-6 h-6 text-[#C0FFTC]" />
              <span className="font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">AES-256 Encryption</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3 p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30"
              whileHover={{ scale: 1.05, shadow: "0 0 20px #C0FFTC" }}
            >
              <CheckCircle className="w-6 h-6 text-[#C0FFTC]" />
              <span className="font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">IPFS Storage</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-3 p-6 bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl border-2 border-[#C0FFTC] shadow-[#C0FFTC]/30"
              whileHover={{ scale: 1.05, shadow: "0 0 20px #C0FFTC" }}
            >
              <CheckCircle className="w-6 h-6 text-[#C0FFTC]" />
              <span className="font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">Blockchain Proof</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadComponent;