import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Shield, FileText, Zap, ArrowRight, CheckCircle, Upload, Eye, Database, Wallet, X, Home, Sparkles, Activity, Cpu, Users } from 'lucide-react';
import UploadComponent from './components/UploadComponent';
import FilesComponent from './components/FilesComponent';
import AuditComponent from './components/AuditComponent';
import RealtimeDashboard from './components/RealtimeDashboard';
import { useStore } from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { startBlockchainMonitoring, switchToBlockDAG, isBlockDAGNetwork } from './utils/blockchain';

function App() {
  const { 
    walletAddress, 
    isConnected, 
    files, 
    auditLogs, 
    setWallet, 
    disconnectWallet,
    addFile,
    removeFile,
    logFileAccess,
    clearAllData
  } = useStore();
  
  const [currentView, setCurrentView] = useState('landing');
  const [isBlockDAG, setIsBlockDAG] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    agreeToReceive: false,
  });

  // Check BlockDAG network when connected
  useEffect(() => {
    if (isConnected) {
      checkBlockDAGNetwork();
    }
  }, [isConnected]);

  // Check for existing wallet connection on app load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum && isConnected) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && accounts[0] === walletAddress) {
            // Wallet is still connected
            return;
          } else {
            // Wallet disconnected
            disconnectWallet();
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          disconnectWallet();
        }
      }
    };
    checkWalletConnection();

    // Event listener for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWallet(accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [isConnected, walletAddress, disconnectWallet]);

  const checkBlockDAGNetwork = async () => {
    try {
      const onBlockDAG = await isBlockDAGNetwork();
      setIsBlockDAG(onBlockDAG);
    } catch (error) {
      console.error('Error checking BlockDAG network:', error);
    }
  };

  const connectWallet = async () => {
    console.log('🔗 Connect wallet button clicked');
    
    // Show immediate feedback
    toast.loading('Connecting to wallet...', {
      duration: 2000,
      style: {
        background: '#C0FFTC',
        color: '#000',
        fontWeight: 'bold'
      }
    });
    
    if (window.ethereum) {
      console.log('✅ MetaMask detected');
      try {
        console.log('🔄 Switching to BlockDAG network...');
        // First, switch to BlockDAG network
        await switchToBlockDAG();
        
        console.log('📝 Requesting accounts...');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('📋 Accounts received:', accounts);
        
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log('⛓️ Chain ID:', chainId);
          setWallet(accounts[0], chainId);
          
          // Check if connected to BlockDAG network
          await checkBlockDAGNetwork();
          
          // Show success message
          toast.success('Connected to BlockDAG Network!', {
            duration: 4000,
            style: {
              background: '#C0FFTC',
              color: '#000',
              fontWeight: 'bold'
            }
          });
          
          // Switch to dashboard after successful connection
          console.log('🎯 Switching to dashboard...');
          setCurrentView('dashboard');
        }
      } catch (error) {
        console.error('❌ Error connecting to BlockDAG:', error);
        toast.error(`Failed to connect to BlockDAG: ${error.message}`, {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#fff'
          }
        });
      }
    } else {
      console.log('❌ MetaMask not detected');
      toast.error('MetaMask not detected. Please install MetaMask.', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff'
        }
      });
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleFileUploaded = (fileData) => {
    addFile(fileData);
  };

  const handleFileDownloaded = (fileId) => {
    logFileAccess(fileId, 'download');
  };

  // If connected, show dashboard
  if (isConnected && currentView !== 'landing') {
    return (
      <div className="bg-black overflow-hidden w-full min-h-screen relative">
        <Toaster position="top-right" />
        
        {/* Background Elements - Landing Page Style */}
        <div className="absolute top-[-50px] -left-6 w-[850px] h-[854px] bg-[#4fb5ff82] rounded-[425px/427px] backdrop-blur-[50px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)]" />
        <div className="absolute top-0 left-[-68px] w-[1864px] h-[6516px] bg-[#000000ed] backdrop-blur-2xl backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(40px)_brightness(100%)]" />
        <div className="absolute -top-32 left-[760px] w-[2542px] h-[1574px] bg-[#bfff2c] rounded-[1271px/787px] shadow-[0px_4px_4px_#00000040]" />
        <div className="absolute top-[878px] left-[-1527px] w-[2542px] h-[1574px] bg-[#bfff2c] rounded-[1271px/787px] shadow-[0px_4px_4px_#00000040]" />
        <div className="absolute top-[2316px] left-[418px] w-[2542px] h-[1574px] bg-[#bfff2c] rounded-[1271px/787px] shadow-[0px_4px_4px_#00000040]" />
        <div className="absolute top-[4942px] left-[398px] w-[2542px] h-[1574px] bg-[#bfff2c] rounded-[1271px/787px] shadow-[0px_4px_4px_#00000040]" />
        <div className="absolute top-0 left-[-68px] w-[1864px] h-[6564px] bg-[#000000d6] backdrop-blur-[248px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(248px)_brightness(100%)]" />
        
        {/* Enhanced Dashboard Header - Mobile Responsive */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-50 bg-black/80 backdrop-blur-lg border-b border-[#C0FFTC]/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 lg:py-6">
              <motion.div 
                className="flex items-center space-x-2 lg:space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center"
                  >
                    <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-black" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-[#C0FFTC] rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-[#C0FFTC] to-[#86efac] bg-clip-text text-transparent [font-family:'Inter-SemiBold',Helvetica]">
                    VaultifyChain
                  </h1>
                  <p className="text-xs text-white/70 [font-family:'Inter-Regular',Helvetica] hidden sm:block">BlockDAG Powered Storage</p>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-2 lg:space-x-6">

                {/* Wallet Address - Mobile Responsive */}
                <motion.div 
                  className="hidden sm:flex items-center space-x-2 lg:space-x-3 bg-gradient-to-r from-[#C0FFTC]/20 to-[#86efac]/20 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-full border border-[#C0FFTC]/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-[#C0FFTC] rounded-full"
                  />
                  <span className="text-xs lg:text-sm font-medium text-[#C0FFTC] [font-family:'Inter-SemiBold',Helvetica]">
                    {formatAddress(walletAddress)}
                  </span>
                </motion.div>
                
                {/* Back to Landing Button */}
                <motion.button
                  onClick={() => setCurrentView('landing')}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-[#C0FFTC] transition-colors rounded-lg hover:bg-[#C0FFTC]/10 [font-family:'Inter-SemiBold',Helvetica]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-4 h-4" />
                  <span>Back to Landing</span>
                </motion.button>
                
                {/* Disconnect Button */}
                <motion.button
                  onClick={() => {
                    clearAllData();
                    window.location.reload();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 [font-family:'Inter-SemiBold',Helvetica]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                  <span>Disconnect</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Enhanced Navigation - Mobile Responsive */}
        <motion.nav 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative z-40 bg-black/60 backdrop-blur-sm border-b border-[#C0FFTC]/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 lg:gap-4 py-4">
              {[
                { id: 'landing', label: 'Landing' },
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'realtime', label: 'Monitor' },
                { id: 'upload', label: 'Upload' },
                { id: 'files', label: 'Files' },
                { id: 'audit', label: 'Audit' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base [font-family:'Inter-Regular',Helvetica] font-normal hover:text-[#bfff2c] transition-colors ${
                    currentView === tab.id 
                      ? 'text-[#bfff2c] bg-[#C0FFTC]/10' 
                      : 'text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>

        {/* Main Content with Animated Transitions - Mobile Responsive */}
        <main className="min-h-screen bg-black relative overflow-hidden w-full">
          {/* Background Elements - Mobile Responsive */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#C0FFTC]/5 to-purple-600/5"></div>
          <div className="absolute top-20 right-4 lg:right-20 w-48 h-48 lg:w-96 lg:h-96 bg-[#C0FFTC]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-4 lg:left-20 w-40 h-40 lg:w-80 lg:h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
                  <motion.div 
                    className="text-center mb-8 lg:mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.h1 
                      className="text-3xl sm:text-4xl lg:text-6xl xl:text-8xl font-bold bg-gradient-to-r from-[#C0FFTC] via-[#86efac] to-[#4ade80] bg-clip-text text-transparent mb-4 lg:mb-6 [font-family:'Inter-SemiBold',Helvetica]"
                      animate={{ 
                        backgroundPosition: ['0%', '100%', '0%'],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    >
                      BlockDAG VaultifyChain
                    </motion.h1>
                    <motion.p 
                      className="text-lg sm:text-xl lg:text-2xl text-white font-semibold mb-6 lg:mb-8 [font-family:'Inter-SemiBold',Helvetica]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Powered by BlockDAG - Superior Performance & Security
                    </motion.p>
                    
                    {/* Real-time Activity Indicator */}
                    <motion.div 
                      className="flex items-center justify-center space-x-2 mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"
                      />
                      <span className="text-sm text-white font-medium">Live on Blockchain</span>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Dashboard Cards - Mobile Responsive */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {/* Upload Files Card - Mobile Responsive */}
                    <motion.div 
                      onClick={() => setCurrentView('upload')}
                      className="relative bg-black rounded-2xl p-4 lg:p-8 border-2 border-[#C0FFTC] hover:border-[#C0FFTC] hover:shadow-[#C0FFTC]/40 hover:bg-[#C0FFTC]/5 transition-all duration-300 cursor-pointer group shadow-[#C0FFTC]/20"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-[#C0FFTC]/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="relative z-10">
                        <motion.div 
                          className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-4 lg:mb-6"
                          whileHover={{ rotate: 5 }}
                        >
                          <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-black" />
                        </motion.div>
                        <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 lg:mb-4 [font-family:'Inter-SemiBold',Helvetica]">Upload Files</h3>
                        <p className="text-white font-medium mb-4 lg:mb-6 text-sm lg:text-base [font-family:'Inter-Medium',Helvetica]">
                          Encrypt and store your files securely with blockchain verification.
                        </p>
                        <motion.button 
                          className="w-full bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 flex items-center justify-center space-x-2 text-sm lg:text-base [font-family:'Inter-SemiBold',Helvetica]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Now</span>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* View Files Card */}
                    <motion.div 
                      onClick={() => setCurrentView('files')}
                      className="relative bg-black rounded-2xl p-8 border-2 border-[#C0FFTC] hover:border-[#C0FFTC] hover:shadow-[#C0FFTC]/40 hover:bg-[#C0FFTC]/5 shadow-[#C0FFTC]/20 transition-all duration-300 cursor-pointer group"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-[#C0FFTC]/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="relative z-10">
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <Eye className="w-8 h-8 text-black" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">My Files</h3>
                        <p className="text-white font-medium mb-6 [font-family:'Inter-Medium',Helvetica]">
                          View and manage your encrypted files and shared access.
                        </p>
                        <motion.button 
                          className="w-full bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black px-6 py-3 rounded-lg hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Files</span>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Audit Log Card */}
                    <motion.div 
                      onClick={() => setCurrentView('audit')}
                      className="relative bg-black rounded-2xl p-8 border-2 border-[#C0FFTC] hover:border-[#C0FFTC] hover:shadow-[#C0FFTC]/40 hover:bg-[#C0FFTC]/5 shadow-[#C0FFTC]/20 transition-all duration-300 cursor-pointer group"
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-[#C0FFTC]/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="relative z-10">
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <Database className="w-8 h-8 text-black" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">Audit Log</h3>
                        <p className="text-white font-medium mb-6 [font-family:'Inter-Medium',Helvetica]">
                          Track all file access and blockchain events for compliance.
                        </p>
                        <motion.button 
                          className="w-full bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black px-6 py-3 rounded-lg hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Database className="w-4 h-4" />
                          <span>View Logs</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Quick Stats */}
                  <motion.div 
                    className="mt-12 bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-[#C0FFTC]/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.h3 
                      className="text-2xl font-semibold bg-gradient-to-r from-[#C0FFTC] to-[#86efac] bg-clip-text text-transparent mb-8 text-center [font-family:'Inter-SemiBold',Helvetica]"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Real-time Statistics
                    </motion.h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        {
                          label: 'Files Uploaded',
                          value: files.length,
                          icon: Upload
                        },
                        {
                          label: 'Audit Events',
                          value: auditLogs.length,
                          icon: Activity
                        },
                        {
                          label: 'Network Status',
                          value: isBlockDAG ? 'BlockDAG' : 'Disconnected',
                          color: isBlockDAG ? 'green' : 'red',
                          icon: Cpu
                        },
                        {
                          label: 'Storage Used',
                          value: `${(files.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(1)} MB`,
                          icon: Database
                        }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          className="text-center p-6 bg-black rounded-xl border-2 border-[#C0FFTC] hover:border-[#C0FFTC] hover:shadow-[#C0FFTC]/40 hover:bg-[#C0FFTC]/5 transition-all duration-300 shadow-[#C0FFTC]/20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.3 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <motion.div
                            className="w-12 h-12 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center mx-auto mb-4"
                            whileHover={{ rotate: 5 }}
                          >
                            <stat.icon className="w-6 h-6 text-black" />
                          </motion.div>
                          <motion.div
                            className="text-4xl font-bold text-[#C0FFTC] mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            {stat.value}
                          </motion.div>
                          <div className="text-white/80 text-sm [font-family:'Inter-Regular',Helvetica]">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentView === 'realtime' && (
              <motion.div
                key="realtime"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RealtimeDashboard />
              </motion.div>
            )}

            {currentView === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UploadComponent onFileUploaded={handleFileUploaded} />
              </motion.div>
            )}

            {currentView === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FilesComponent onFileDownloaded={handleFileDownloaded} />
              </motion.div>
            )}

            {currentView === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AuditComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Landing page (when not connected or when currentView is 'landing') - Users must connect wallet first
  return (
    <div className="bg-black overflow-hidden w-full min-h-screen relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '2px solid #C0FFTC',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(192, 255, 204, 0.3)',
          },
        }}
      />
      
      {/* Background Elements - Mobile Responsive */}
      <div className="absolute top-[-50px] -left-6 w-[850px] h-[854px] bg-[#4fb5ff82] rounded-[425px/427px] backdrop-blur-[50px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)] hidden lg:block" />
      <div className="absolute top-0 left-0 w-full h-full bg-[#000000ed] backdrop-blur-2xl backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(40px)_brightness(100%)]" />
      <div className="absolute -top-32 right-4 lg:right-20 w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] bg-[#bfff2c] rounded-full shadow-[0px_4px_4px_#00000040] animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] lg:w-[300px] lg:h-[300px] bg-[#bfff2c] rounded-full shadow-[0px_4px_4px_#00000040] animate-pulse delay-1000" />
      <div className="absolute bottom-20 right-1/4 w-[100px] h-[100px] lg:w-[250px] lg:h-[250px] bg-[#bfff2c] rounded-full shadow-[0px_4px_4px_#00000040] animate-pulse delay-2000" />
      
      {/* Header - Mobile Responsive */}
      <header className="relative z-50 bg-black/80 backdrop-blur-lg border-b border-[#C0FFTC]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <motion.div 
              className="flex items-center space-x-2 lg:space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-xl flex items-center justify-center"
              >
                <Shield className="w-4 h-4 lg:w-6 lg:h-6 text-black" />
              </motion.div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-[#C0FFTC] to-[#86efac] bg-clip-text text-transparent [font-family:'Inter-SemiBold',Helvetica]">
                  VaultifyChain
                </h1>
                <p className="text-xs text-white/70 [font-family:'Inter-Regular',Helvetica] hidden sm:block">BlockDAG Powered Storage</p>
              </div>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-white hover:text-[#bfff2c] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Features", href: "#features" },
                { label: "Contact", href: "#contact" }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="[font-family:'Inter-Regular',Helvetica] font-normal text-white text-lg hover:text-[#bfff2c] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Hero Section - Mobile Responsive */}
      <section id="home" className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold [font-family:'Inter-SemiBold',Helvetica] leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">Share Data</span>
                <br />
                <span className="text-[#bfff2c]">Securely</span>
                <br />
                <span className="text-white">Build Trust</span>
                <br />
                <span className="text-[#bfff2c]">Instantly!</span>
              </motion.h1>

              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-white/80 [font-family:'Inter-Regular',Helvetica] leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Empowering businesses to exchange sensitive information with total
                confidence. Our blockchain-powered platform encrypts every file,
                verifies every access, and ensures only authorized users stay in
                control.
              </motion.p>

              <motion.button 
                onClick={connectWallet}
                className="w-full sm:w-auto bg-gradient-to-r from-[#bfff2c] to-[#86efac] text-black px-6 lg:px-8 py-3 lg:py-4 rounded-lg text-lg lg:text-xl font-semibold hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 [font-family:'Inter-SemiBold',Helvetica] shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Demo
              </motion.button>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center order-first lg:order-last"
            >
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-[#bfff2c]/20 to-transparent rounded-2xl backdrop-blur-sm border border-[#bfff2c]/30 flex items-center justify-center">
                <motion.div 
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-[#bfff2c] rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-black" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Steps Section - Mobile Responsive */}
      <section id="features" className="relative z-10 py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold text-[#bfff2c] [font-family:'Inter-SemiBold',Helvetica] mb-6 lg:mb-8">
              How We Keep Your Data Safe
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1: End-to-End Encryption */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300 relative group"
            >
              <div className="absolute top-4 left-4 text-[#bfff2c] text-sm font-medium [font-family:'Inter-Medium',Helvetica]">
                STEP ONE
              </div>
              <div className="w-16 h-16 bg-[#bfff2c] rounded-full flex items-center justify-center text-2xl mt-8 mb-6 group-hover:scale-110 transition-transform duration-300">
                🔐
              </div>
              <h3 className="text-3xl font-semibold text-[#bfff2c] mb-4 [font-family:'Inter-Medium',Helvetica]">
                End-to-End Encryption
              </h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica] leading-relaxed">
                Every file you upload is encrypted instantly before it leaves your device. No one — not even us — can see it. Only authorized users with wallet-based access can decrypt it.
              </p>
            </motion.div>

            {/* Step 2: Blockchain Verification */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300 relative group"
            >
              <div className="absolute top-4 left-4 text-[#bfff2c] text-sm font-medium [font-family:'Inter-Medium',Helvetica]">
                STEP TWO
              </div>
              <div className="w-16 h-16 bg-[#bfff2c] rounded-full flex items-center justify-center text-2xl mt-8 mb-6 group-hover:scale-110 transition-transform duration-300">
                ⛓️
              </div>
              <h3 className="text-3xl font-semibold text-[#bfff2c] mb-4 [font-family:'Inter-Medium',Helvetica]">
                Blockchain Verification
              </h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica] leading-relaxed">
                Our system uses the BlockDAG chain to log every file access, share, or modification on-chain — creating a transparent and tamper-proof audit trail.
              </p>
            </motion.div>

            {/* Step 3: Complete Control */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300 relative group"
            >
              <div className="absolute top-4 left-4 text-[#bfff2c] text-sm font-medium [font-family:'Inter-Medium',Helvetica]">
                STEP THREE
              </div>
              <div className="w-16 h-16 bg-[#bfff2c] rounded-full flex items-center justify-center text-2xl mt-8 mb-6 group-hover:scale-110 transition-transform duration-300">
                🛡️
              </div>
              <h3 className="text-3xl font-semibold text-[#bfff2c] mb-4 [font-family:'Inter-Medium',Helvetica]">
                Complete Control
              </h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica] leading-relaxed">
                Access is granted only through verified wallet keys. No passwords, no middlemen — just cryptographic security that puts you in complete control.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="relative z-10 py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold [font-family:'Inter-Medium',Helvetica] mb-6 lg:mb-8">
              <span className="text-white">Why Choose</span>
              <br />
              <span className="text-[#bfff2c]">VaultifyChain?</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 [font-family:'Inter-Regular',Helvetica] max-w-4xl mx-auto">
              The most advanced blockchain-powered file storage solution with enterprise-grade security and transparency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">Military-Grade Encryption</h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">
                AES-256 encryption ensures your files are protected with the same security standards used by governments and financial institutions.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">Decentralized Storage</h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">
                Files are stored on IPFS, ensuring redundancy, availability, and resistance to censorship or single points of failure.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">Blockchain Audit Trail</h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">
                Every file access, share, and modification is recorded on the blockchain, providing an immutable audit trail for compliance.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">Granular Access Control</h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">
                Control exactly who can access your files with wallet-based permissions and time-limited access tokens.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">BlockDAG Technology</h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">
                Built on BlockDAG for superior scalability, faster transactions, and lower costs compared to traditional blockchains.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#C0FFTC] to-[#86efac] rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">Real-time Monitoring</h3>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">
                Monitor file access, blockchain status, and system health in real-time with our advanced dashboard.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Waitlist Section - Enhanced */}
      <section id="contact" className="relative z-10 py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold [font-family:'Inter-Medium',Helvetica] mb-6 lg:mb-8">
              <span className="text-white">Join the</span>
              <br />
              <span className="text-[#bfff2c]">Revolution</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 [font-family:'Inter-Regular',Helvetica] max-w-4xl mx-auto">
              Be among the first to experience the future of secure file storage. Get early access and exclusive benefits.
            </p>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-[#C0FFTC] mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                10K+
              </motion.div>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">Files Secured</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-[#C0FFTC] mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                99.9%
              </motion.div>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">Uptime</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-[#C0FFTC] mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                256-bit
              </motion.div>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">Encryption</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-[#C0FFTC] mb-2 [font-family:'Inter-SemiBold',Helvetica]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                24/7
              </motion.div>
              <p className="text-white/80 [font-family:'Inter-Regular',Helvetica]">Monitoring</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Inter-SemiBold',Helvetica]">
                  Get Early Access
                </h3>
                <p className="text-white/80 text-lg [font-family:'Inter-Regular',Helvetica] mb-6">
                  Join thousands of forward-thinking organizations already on the waitlist for VaultifyChain.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#bfff2c]" />
                  <span className="text-white [font-family:'Inter-Regular',Helvetica]">Priority access to new features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#bfff2c]" />
                  <span className="text-white [font-family:'Inter-Regular',Helvetica]">Exclusive beta testing opportunities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#bfff2c]" />
                  <span className="text-white [font-family:'Inter-Regular',Helvetica]">Special pricing for early adopters</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#bfff2c]" />
                  <span className="text-white [font-family:'Inter-Regular',Helvetica]">Direct line to our development team</span>
                </div>
              </div>
            </motion.div>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#C0FFTC]/20 hover:border-[#C0FFTC]/40 transition-all duration-300"
            >
              <form onSubmit={(e) => { e.preventDefault(); console.log("Form submitted:", formData); }}>
                {/* Name Field */}
                <div className="mb-6">
                  <label className="block text-white text-lg font-semibold mb-3 [font-family:'Inter-SemiBold',Helvetica]">
                    What's Your Name?
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full h-12 bg-[#1e2c00] rounded-lg border border-[#C0FFTC]/30 px-4 text-white placeholder-gray-400 [font-family:'Inter-Regular',Helvetica] focus:border-[#C0FFTC] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Company Field */}
                <div className="mb-6">
                  <label className="block text-white text-lg font-semibold mb-3 [font-family:'Inter-SemiBold',Helvetica]">
                    Your Company?
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company Name"
                    className="w-full h-12 bg-[#1e2c00] rounded-lg border border-[#C0FFTC]/30 px-4 text-white placeholder-gray-400 [font-family:'Inter-Regular',Helvetica] focus:border-[#C0FFTC] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-6">
                  <label className="block text-white text-lg font-semibold mb-3 [font-family:'Inter-SemiBold',Helvetica]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@gmail.com"
                    className="w-full h-12 bg-[#1e2c00] rounded-lg border border-[#C0FFTC]/30 px-4 text-white placeholder-gray-400 [font-family:'Inter-Regular',Helvetica] focus:border-[#C0FFTC] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3 mb-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToReceive}
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeToReceive: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 ${formData.agreeToReceive ? "bg-[#C0FFTC]" : "bg-gray-600"} rounded border border-[#C0FFTC]/30 flex items-center justify-center transition-colors`}>
                      {formData.agreeToReceive && <CheckCircle className="w-4 h-4 text-black" />}
                    </div>
                    <span className="ml-3 text-white text-sm [font-family:'Inter-Regular',Helvetica]">
                      I agree to receive commercial info
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C0FFTC] to-[#86efac] text-black py-4 rounded-lg text-lg font-semibold hover:from-[#86efac] hover:to-[#4ade80] transition-all duration-300 [font-family:'Inter-SemiBold',Helvetica] shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
