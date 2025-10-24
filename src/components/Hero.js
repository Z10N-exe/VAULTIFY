import React from 'react';
import { Shield, Lock, FileText, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import toast from 'react-hot-toast';

const ConnectWalletButton = () => {
  const { connectWallet, isConnecting } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-2xl disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>Connect Wallet</span>
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/15 rounded-full animate-pulse-slow delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white/8 rounded-full animate-pulse-slow delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-white font-bold text-xl">VaultifyChain</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Secure Storage
            <br />
            <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Meets
            </span>
            <br />
            Verifiable Proof
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            The world's first blockchain-verified file storage platform. 
            <br className="hidden md:block" />
            Encrypt, store, and prove file integrity with zero-trust architecture.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-6 text-white">
            <Lock className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AES-256 Encryption</h3>
            <p className="text-white/80">Military-grade encryption protects your files locally before upload</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 text-white">
            <Shield className="w-12 h-12 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Blockchain Proof</h3>
            <p className="text-white/80">Every file action is recorded on-chain for immutable verification</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 text-white">
            <Zap className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Zero-Trust Access</h3>
            <p className="text-white/80">Only authorized wallets can decrypt and access your files</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <ConnectWalletButton />
          
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>View Demo</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Enterprise Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Open Source</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
