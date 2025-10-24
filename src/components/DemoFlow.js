import React, { useState } from 'react';
import { Upload, Lock, Database, Shield, Eye, CheckCircle, ArrowRight, FileText, Users, Clock } from 'lucide-react';

const DemoFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Upload File",
      description: "Agency A uploads confidential.pdf",
      icon: Upload,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      details: [
        "File selected for upload",
        "AES-256 encryption applied locally",
        "Encrypted file ready for storage"
      ]
    },
    {
      id: 1,
      title: "Encrypt & Store",
      description: "File encrypted and stored on IPFS",
      icon: Lock,
      color: "text-red-500",
      bgColor: "bg-red-50",
      details: [
        "File encrypted with AES-256",
        "Uploaded to IPFS network",
        "IPFS hash generated"
      ]
    },
    {
      id: 2,
      title: "Record on Chain",
      description: "Hash and metadata recorded on BlockDAG",
      icon: Database,
      color: "text-green-500",
      bgColor: "bg-green-50",
      details: [
        "File hash stored on blockchain",
        "Access permissions set",
        "Agency B added as authorized user"
      ]
    },
    {
      id: 3,
      title: "Controlled Access",
      description: "Agency B connects wallet and accesses file",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      details: [
        "Agency B connects MetaMask wallet",
        "System verifies authorization",
        "File decrypted and displayed"
      ]
    },
    {
      id: 4,
      title: "Audit Trail",
      description: "Access event recorded on blockchain",
      icon: Eye,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      details: [
        "Access event logged on-chain",
        "Timestamp and wallet address recorded",
        "Immutable audit trail created"
      ]
    }
  ];

  const demoData = {
    fileHash: "0xABC123...DEF456",
    uploader: "Agency A (0x1234...5678)",
    receiver: "Agency B (0x9ABC...DEF0)",
    timestamp: "2024-01-15 14:30:25 UTC",
    accessCount: 3,
    lastAccess: "2024-01-15 16:45:12 UTC"
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See <span className="text-gradient">VaultifyChain</span> in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow the complete flow from file upload to verifiable access
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Steps Navigation */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Demo Flow</h3>
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeStep === step.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center ${
                    activeStep === step.id ? 'scale-110' : ''
                  } transition-transform duration-300`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {activeStep === step.id && (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Step Details */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[activeStep].title}
              </h3>
              <p className="text-gray-600">
                {steps[activeStep].description}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {steps[activeStep].details.map((detail, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{detail}</span>
                </div>
              ))}
            </div>

            {/* Demo Data */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Demo Data
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Hash:</span>
                  <span className="font-mono text-gray-900">{demoData.fileHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploader:</span>
                  <span className="font-mono text-gray-900">{demoData.uploader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authorized:</span>
                  <span className="font-mono text-gray-900">{demoData.receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upload Time:</span>
                  <span className="font-mono text-gray-900">{demoData.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Access Count:</span>
                  <span className="font-mono text-gray-900">{demoData.accessCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Access:</span>
                  <span className="font-mono text-gray-900">{demoData.lastAccess}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h3>
            <p className="text-lg text-gray-600">Real-world applications and benefits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Compliance</h4>
              <p className="text-gray-600">Meet GDPR, HIPAA, and SOX requirements with immutable audit trails</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Zero-Trust Security</h4>
              <p className="text-gray-600">No central authority can access your files - only authorized users</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Forensic Evidence</h4>
              <p className="text-gray-600">Cryptographic proof of file existence, access, and integrity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoFlow;