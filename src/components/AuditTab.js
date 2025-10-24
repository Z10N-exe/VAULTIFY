import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Upload, 
  Eye, 
  Calendar, 
  Hash,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { getAuditLogs } from '../utils/blockchain';
import toast from 'react-hot-toast';

const AuditTab = () => {
  const { auditLogs, addAuditLog, walletAddress } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (walletAddress) {
      loadAuditLogs();
    }
  }, [walletAddress]);

  const loadAuditLogs = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    try {
      const logs = await getAuditLogs(walletAddress);
      logs.forEach(log => addAuditLog(log));
      toast.success('Audit logs loaded');
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'FileUploaded':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'FileAccessed':
        return <Eye className="w-4 h-4 text-green-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'FileUploaded':
        return 'bg-blue-100 text-blue-800';
      case 'FileAccessed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case 'FileUploaded':
        return 'File Uploaded';
      case 'FileAccessed':
        return 'File Accessed';
      default:
        return 'Unknown Event';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = searchTerm === '' || 
      log.fileHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportAuditLogs = () => {
    const csvContent = [
      'Event Type,File Hash,User,Timestamp,Transaction Hash',
      ...filteredLogs.map(log => 
        `${log.type},${log.fileHash},${log.user},${log.timestamp},${log.txHash}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Audit logs exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
          <p className="text-gray-600">View all blockchain-verified file activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportAuditLogs}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadAuditLogs}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by file hash or user address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Events</option>
              <option value="FileUploaded">File Uploads</option>
              <option value="FileAccessed">File Access</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload and access files to see audit logs here'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => useStore.getState().setCurrentTab('upload')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Your First File
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getEventIcon(log.type)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(log.type)}`}>
                          {getEventLabel(log.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-gray-900">
                          {log.fileHash.slice(0, 8)}...{log.fileHash.slice(-8)}
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(log.fileHash)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Hash className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">
                        {log.user.slice(0, 6)}...{log.user.slice(-4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`https://etherscan.io/tx/${log.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <span className="font-mono text-sm">
                          {log.txHash.slice(0, 8)}...{log.txHash.slice(-8)}
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredLogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Uploads</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {filteredLogs.filter(log => log.type === 'FileUploaded').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Access Events</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {filteredLogs.filter(log => log.type === 'FileAccessed').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Total Events</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredLogs.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTab;