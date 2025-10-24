import React from 'react';
import { Shield, Lock, Eye, Users, FileCheck, Zap, Database, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Files are encrypted locally using AES-256 before upload. Only authorized users can decrypt.",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: Shield,
      title: "Blockchain Verification",
      description: "Every file action is recorded on BlockDAG for immutable proof of existence and access.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Controlled Access",
      description: "Uploaders control who can access files. Add/remove authorized wallets anytime.",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Eye,
      title: "Audit Trail",
      description: "Complete visibility into who accessed what, when, and from where.",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: FileCheck,
      title: "Integrity Verification",
      description: "Verify file hasn't been tampered with using cryptographic hashes.",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description: "Files stored on IPFS for redundancy and censorship resistance.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-gradient">VaultifyChain</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combining the security of encrypted storage with the transparency of blockchain verification
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Simple, secure, and verifiable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload & Encrypt</h4>
              <p className="text-sm text-gray-600">File encrypted locally with AES-256</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Store on IPFS</h4>
              <p className="text-sm text-gray-600">Encrypted file stored on decentralized network</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Record on Chain</h4>
              <p className="text-sm text-gray-600">Hash and metadata recorded on BlockDAG</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Controlled Access</h4>
              <p className="text-sm text-gray-600">Only authorized wallets can decrypt</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
