import React, { useState, useEffect } from 'react';
import { Database, Eye, Upload, Download, Share2, Clock, Hash, User, ExternalLink, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuditComponent = ({ auditLogs, files }) => {
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let logs = auditLogs;

    // Filter by type
    if (filter !== 'all') {
      logs = logs.filter(log => log.type === filter);
    }

    // Search filter
    if (searchTerm) {
      logs = logs.filter(log => 
        log.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.txHash?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(logs);
  }, [auditLogs, filter, searchTerm]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'FileUploaded':
        return <Upload className="w-5 h-5 text-[#C0FFTC]" />;
      case 'FileAccessed':
        return <Eye className="w-5 h-5 text-[#C0FFTC]" />;
      case 'FileDownloaded':
        return <Download className="w-5 h-5 text-[#C0FFTC]" />;
      case 'FileShared':
        return <Share2 className="w-5 h-5 text-[#C0FFTC]" />;
      default:
        return <Database className="w-5 h-5 text-[#C0FFTC]" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'FileUploaded':
        return 'bg-[#C0FFTC]/10 border-[#C0FFTC]/30';
      case 'FileAccessed':
        return 'bg-[#C0FFTC]/10 border-[#C0FFTC]/30';
      case 'FileDownloaded':
        return 'bg-[#C0FFTC]/10 border-[#C0FFTC]/30';
      case 'FileShared':
        return 'bg-[#C0FFTC]/10 border-[#C0FFTC]/30';
      default:
        return 'bg-[#C0FFTC]/10 border-[#C0FFTC]/30';
    }
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

  const getFileByHash = (fileHash) => {
    return files.find(file => file.hash === fileHash);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
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
              <Database className="w-8 h-8 text-black" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                Audit Log
              </h1>
              <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">
                Track all blockchain events and file activities
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                <input
                  type="text"
                  placeholder="Search by file name, user, or transaction hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black border-2 border-[#C0FFTC] rounded-lg focus:ring-2 focus:ring-[#C0FFTC] focus:border-[#C0FFTC] text-white placeholder-white/70 vaultify-input"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {['all', 'FileUploaded', 'FileAccessed', 'FileDownloaded', 'FileShared'].map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-[#C0FFTC] text-black'
                      : 'bg-black border-2 border-[#C0FFTC] text-white hover:bg-[#C0FFTC]/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterType === 'all' ? 'All Events' : filterType.replace('File', '')}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div 
              className="bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl p-4 border border-[#C0FFTC]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    {auditLogs.filter(log => log.type === 'FileUploaded').length}
                  </p>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">Uploads</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl p-4 border border-[#C0FFTC]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    {auditLogs.filter(log => log.type === 'FileDownloaded').length}
                  </p>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">Downloads</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl p-4 border border-[#C0FFTC]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    {auditLogs.filter(log => log.type === 'FileShared').length}
                  </p>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">Shares</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#C0FFTC]/10 backdrop-blur-sm rounded-xl p-4 border border-[#C0FFTC]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white [font-family:'Inter-SemiBold',Helvetica]">
                    {auditLogs.filter(log => log.type === 'FileAccessed').length}
                  </p>
                  <p className="text-white/70 text-sm [font-family:'Inter-Regular',Helvetica]">Accesses</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
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
                  No audit logs found
                </h3>
                <p className="text-white/70 [font-family:'Inter-Regular',Helvetica]">
                  {searchTerm ? 'Try adjusting your search terms' : 'File activities will appear here'}
                </p>
              </motion.div>
            ) : (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl border-2 ${getEventColor(log.type)} vaultify-card`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center">
                        {getEventIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white [font-family:'Inter-SemiBold',Helvetica]">
                            {log.type.replace('File', '')}
                          </h3>
                          <span className="px-2 py-1 bg-[#C0FFTC]/20 text-[#C0FFTC] rounded-full text-xs font-medium">
                            {log.type}
                          </span>
                        </div>
                        {log.fileName && (
                          <p className="text-white/80 mb-2 [font-family:'Inter-Regular',Helvetica]">
                            File: <span className="font-medium">{log.fileName}</span>
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-white/70 [font-family:'Inter-Regular',Helvetica]">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{log.user || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(log.timestamp)}</span>
                          </div>
                          {log.txHash && (
                            <div className="flex items-center space-x-1">
                              <Hash className="w-4 h-4" />
                              <span className="truncate max-w-32">{log.txHash}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {log.txHash && (
                        <motion.button
                          className="p-2 text-white/70 hover:text-[#C0FFTC] transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuditComponent;