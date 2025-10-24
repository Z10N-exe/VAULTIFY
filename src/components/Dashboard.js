import React, { useState, useEffect } from 'react';
import { Shield, Upload, Eye, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWallet } from '../hooks/useWallet';
import UploadTab from './UploadTab';
import FilesTab from './FilesTab';
import AuditTab from './AuditTab';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentTab, setCurrentTab, walletAddress } = useStore();
  const { disconnect } = useWallet();

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'upload', label: 'Upload File', icon: Upload },
    { id: 'files', label: 'My Files', icon: Eye },
    { id: 'audit', label: 'Audit Logs', icon: Eye }
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'upload':
        return <UploadTab />;
      case 'files':
        return <FilesTab />;
      case 'audit':
        return <AuditTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">VaultifyChain</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <nav className="mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 ${
                  currentTab === tab.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center space-x-2 p-4 border-b">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VaultifyChain</span>
          </div>
          
          <nav className="mt-4 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 ${
                  currentTab === tab.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Connected Wallet</p>
              <p className="text-sm font-mono text-gray-900 truncate">
                {walletAddress}
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-500" />
          </button>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">VaultifyChain</span>
          </div>
          <div className="w-6" />
        </div>

        {/* Content */}
        <main className="p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard overview component
const DashboardTab = () => {
  const { files, sharedFiles, auditLogs } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your secure file storage dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Files Uploaded</p>
              <p className="text-2xl font-bold text-gray-900">{files.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Files Shared</p>
              <p className="text-2xl font-bold text-gray-900">{sharedFiles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Audit Events</p>
              <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => useStore.getState().setCurrentTab('upload')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload a new file</p>
          </button>
          <button
            onClick={() => useStore.getState().setCurrentTab('files')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">View your files</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
