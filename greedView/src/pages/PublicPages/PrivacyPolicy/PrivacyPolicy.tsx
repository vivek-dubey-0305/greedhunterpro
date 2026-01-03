import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Back to Home */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-[#00ff88] hover:text-[#00d9ff] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#ff0055] rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-20 h-20 text-[#ff0055] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Privacy <span className="text-[#ff0055]">Policy</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              Your privacy and security are our top priorities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="bg-[#141420] p-8 rounded-lg border border-[#ff0055]/20 mb-8">
              <p className="text-gray-300 mb-6">
                <strong className="text-white">Last updated:</strong> December 12, 2025
              </p>
              <p className="text-gray-300">
                This Privacy Policy describes how GreedHunter ("we," "us," or "our") collects, uses, and protects your personal information when you use our gaming platform and services.
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ff0055]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-[#ff0055]" />
                  <h2 className="text-2xl font-bold">Information We Collect</h2>
                </div>
                <ul className="text-gray-300 space-y-2 ml-9">
                  <li><strong>Personal Information:</strong> Name, email address, date of birth, and payment information</li>
                  <li><strong>Gaming Data:</strong> Game statistics, achievements, and in-game purchases</li>
                  <li><strong>Device Information:</strong> IP address, device type, browser information, and operating system</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform and services</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ff0055]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-[#ff0055]" />
                  <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                </div>
                <ul className="text-gray-300 space-y-2 ml-9">
                  <li>Provide and maintain our gaming services</li>
                  <li>Process transactions and send receipts</li>
                  <li>Send you updates, security alerts, and support messages</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ff0055]/20"
              >
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-gray-300">
                  We implement industry-leading security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ff0055]/20"
              >
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="text-gray-300 mb-4">
                  You have the right to:
                </p>
                <ul className="text-gray-300 space-y-2 ml-9">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Data portability</li>
                  <li>Lodge a complaint with supervisory authorities</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ff0055]/20"
              >
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="text-[#ff0055]">
                  <p>Email: privacy@greedhunter.com</p>
                  <p>Address: 123 Gaming Street, Digital City</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
