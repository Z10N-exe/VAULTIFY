import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Share, 
  Eye, 
  Lock, 
  Calendar, 
  Hash,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { retrieveFromIPFS } from '../utils/ipfs';
import { decryptFile } from '../utils/encryption';
import { logFileAccess } from '../utils/blockchain';
import toast from 'react-hot-toast';

const FilesTab = () => {
  const { files, sharedFiles } = useStore();
  const [copiedHash, setCopiedHash] = useState(null);
  const [accessingFile, setAccessingFile] = useState(null);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(type);
      setTimeout(() => setCopiedHash(null), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleAccessFile = async (file) => {
    setAccessingFile(file.id);
    
    try {
      // Log access on blockchain
      await logFileAccess(file.hash);
      
      // Retrieve from IPFS
      const ipfsFile = await retrieveFromIPFS(file.cid);
      
      // Prompt for password
      const password = prompt('Enter the encryption password:');
      if (!password) return;
      
      // Decrypt file
      const decryptedData = decryptFile(ipfsFile.text, password);
      
      // Create download link
      const blob = new Blob([decryptedData], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
      
    } catch (error) {
      console.error('Access failed:', error);
      toast.error(`Failed to access file: ${error.message}`);
    } finally {
      setAccessingFile(null);
    }
  };

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

  const allFiles = [...files, ...sharedFiles];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Files</h1>
        <p className="text-gray-600">Manage your uploaded and shared files</p>
      </div>

      {allFiles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
          <p className="text-gray-500 mb-6">Upload your first file to get started</p>
          <button
            onClick={() => useStore.getState().setCurrentTab('upload')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 truncate max-w-48">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.encrypted && (
                    <Lock className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Upload Date:</span>
                  <span className="text-gray-900">{formatDate(file.uploadDate)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Receiver:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {file.receiver?.slice(0, 6)}...{file.receiver?.slice(-4)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">File Hash:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-mono text-xs">
                      {file.hash?.slice(0, 8)}...{file.hash?.slice(-8)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(file.hash, file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedHash === file.id ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {file.txHash && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Transaction:</span>
                    <a
                      href={`https://etherscan.io/tx/${file.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span className="font-mono text-xs">
                        {file.txHash.slice(0, 8)}...{file.txHash.slice(-8)}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccessFile(file)}
                  disabled={accessingFile === file.id}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {accessingFile === file.id ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>Accessing...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Access File</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => copyToClipboard(file.cid, `cid-${file.id}`)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-1"
                >
                  <Hash className="w-3 h-3" />
                  <span>IPFS</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesTab;
