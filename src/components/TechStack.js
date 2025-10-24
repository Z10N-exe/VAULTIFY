import React from 'react';
import { Code, Database, Shield, Globe, Zap, Lock } from 'lucide-react';

const TechStack = () => {
  const techStack = [
    {
      category: "Frontend",
      icon: Code,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      technologies: [
        { name: "React", description: "Modern UI framework" },
        { name: "Tailwind CSS", description: "Utility-first styling" },
        { name: "Framer Motion", description: "Smooth animations" },
        { name: "Web3.js", description: "Blockchain integration" }
      ]
    },
    {
      category: "Encryption",
      icon: Lock,
      color: "text-red-500",
      bgColor: "bg-red-50",
      technologies: [
        { name: "AES-256", description: "Military-grade encryption" },
        { name: "CryptoJS", description: "Client-side crypto" },
        { name: "Web Crypto API", description: "Native browser crypto" },
        { name: "Key Derivation", description: "PBKDF2 key generation" }
      ]
    },
    {
      category: "Storage",
      icon: Database,
      color: "text-green-500",
      bgColor: "bg-green-50",
      technologies: [
        { name: "IPFS", description: "Decentralized file storage" },
        { name: "Web3.Storage", description: "IPFS pinning service" },
        { name: "Filecoin", description: "Long-term storage" },
        { name: "Arweave", description: "Permanent storage option" }
      ]
    },
    {
      category: "Blockchain",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      technologies: [
        { name: "BlockDAG", description: "Smart contract platform" },
        { name: "MetaMask", description: "Wallet integration" },
        { name: "WalletConnect", description: "Mobile wallet support" },
        { name: "Ethers.js", description: "Blockchain interactions" }
      ]
    },
    {
      category: "Backend",
      icon: Globe,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      technologies: [
        { name: "Node.js", description: "Runtime environment" },
        { name: "Express.js", description: "API framework" },
        { name: "IPFS API", description: "File upload service" },
        { name: "Web3 Gateway", description: "Blockchain proxy" }
      ]
    },
    {
      category: "Security",
      icon: Zap,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      technologies: [
        { name: "Zero-Trust", description: "No implicit trust model" },
        { name: "End-to-End", description: "Client-side encryption" },
        { name: "Audit Logs", description: "Immutable records" },
        { name: "Access Control", description: "Wallet-based permissions" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built with <span className="text-gradient">Modern Tech</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade security meets cutting-edge blockchain technology
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {techStack.map((category, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center mr-4`}>
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
              </div>
              
              <div className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h4 className="font-medium text-gray-900">{tech.name}</h4>
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">System Architecture</h3>
            <p className="text-lg text-gray-600">How all the pieces work together</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Client Layer */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Client Layer</h4>
              <p className="text-sm text-gray-600 mb-4">React + Web3</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• File encryption</li>
                <li>• Wallet connection</li>
                <li>• Access control</li>
              </ul>
            </div>

            {/* Storage Layer */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Storage Layer</h4>
              <p className="text-sm text-gray-600 mb-4">IPFS + Filecoin</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Encrypted files</li>
                <li>• Decentralized storage</li>
                <li>• Redundancy</li>
              </ul>
            </div>

            {/* Blockchain Layer */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Layer</h4>
              <p className="text-sm text-gray-600 mb-4">BlockDAG + Smart Contracts</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• File hashes</li>
                <li>• Access logs</li>
                <li>• Immutable proof</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
