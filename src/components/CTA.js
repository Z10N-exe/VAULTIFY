import React from 'react';
import { ArrowRight, Github, Twitter, Mail, Zap, Shield, Globe } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Build the 
              <br />
              <span className="text-yellow-300">Future of Storage</span>?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12">
              Join the revolution in secure, verifiable file storage. 
              Start building with VaultifyChain today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-2xl">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Zap className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Quick Start</h3>
              <p className="text-white/80 mb-4">
                Get up and running in minutes with our comprehensive documentation and examples.
              </p>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• 5-minute setup guide</li>
                <li>• Code examples</li>
                <li>• API documentation</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Shield className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise Ready</h3>
              <p className="text-white/80 mb-4">
                Built for enterprise use with compliance, security, and scalability in mind.
              </p>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• SOC 2 compliance</li>
                <li>• GDPR ready</li>
                <li>• 99.9% uptime SLA</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Globe className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Open Source</h3>
              <p className="text-white/80 mb-4">
                Fully open source with active community support and transparent development.
              </p>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• MIT license</li>
                <li>• Community driven</li>
                <li>• Regular updates</li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Get in Touch</h3>
              <p className="text-white/80 text-lg">
                Have questions? Want to contribute? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Email Us</h4>
                <p className="text-white/80 mb-2">hello@vaultifychain.com</p>
                <p className="text-sm text-white/60">We'll respond within 24 hours</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">GitHub</h4>
                <p className="text-white/80 mb-2">github.com/vaultifychain</p>
                <p className="text-sm text-white/60">Open issues and PRs</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Twitter className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Twitter</h4>
                <p className="text-white/80 mb-2">@vaultifychain</p>
                <p className="text-sm text-white/60">Latest updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
