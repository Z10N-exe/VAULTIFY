import React, { useState, useRef } from 'react';
import { Upload, Lock, Share, X, FileText, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { encryptFile, generateFileHash } from '../utils/encryption';
import { uploadToIPFS } from '../utils/ipfs';
import { uploadFileToBlockchain } from '../utils/blockchain';
import toast from 'react-hot-toast';

const UploadTab = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { addFile } = useStore();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('File size must be less than 100MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !receiverAddress || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!receiverAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Encrypt file
      toast.loading('Encrypting file...', { id: 'encrypt' });
      const encryptedData = await encryptFile(selectedFile, password);
      const fileHash = generateFileHash(encryptedData);

      // Step 2: Upload to IPFS
      toast.loading('Uploading to IPFS...', { id: 'ipfs' });
      const { cid, url } = await uploadToIPFS(encryptedData, selectedFile.name);

      // Step 3: Record on blockchain
      toast.loading('Recording on blockchain...', { id: 'blockchain' });
      const { txHash } = await uploadFileToBlockchain(fileHash, cid, receiverAddress);

      // Step 4: Add to local state
      const fileRecord = {
        id: Date.now().toString(),
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        hash: fileHash,
        cid,
        url,
        txHash,
        receiver: receiverAddress,
        uploadDate: new Date(),
        encrypted: true
      };

      addFile(fileRecord);

      toast.success('File uploaded successfully!', { id: 'success' });
      
      // Reset form
      setSelectedFile(null);
      setReceiverAddress('');
      setPassword('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`, { id: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload File</h1>
        <p className="text-gray-600">Securely upload and share files with blockchain verification</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Drop your file here</p>
                    <p className="text-gray-500">or click to browse</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Receiver Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receiver Address
            </label>
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the Ethereum address of the person you want to share with
            </p>
          </div>

          {/* Encryption Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              This password will be used to encrypt your file. Share it securely with the receiver.
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your file will be encrypted locally before upload. Only the receiver with the correct password can decrypt it.
                  The file hash and access logs will be recorded on the blockchain for verification.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !receiverAddress || !password || isUploading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Upload & Encrypt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadTab;
