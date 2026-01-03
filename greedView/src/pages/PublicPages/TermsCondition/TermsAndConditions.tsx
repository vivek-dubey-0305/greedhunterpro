import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
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
              className="absolute w-2 h-2 bg-[#ffd700] rounded-full opacity-60"
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
            <FileText className="w-20 h-20 text-[#ffd700] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Terms & <span className="text-[#ffd700]">Conditions</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              Please read these terms carefully before using GreedHunter
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
            <div className="bg-[#141420] p-8 rounded-lg border border-[#ffd700]/20 mb-8">
              <p className="text-gray-300 mb-6">
                <strong className="text-white">Last updated:</strong> December 12, 2025
              </p>
              <p className="text-gray-300">
                These Terms and Conditions ("Terms") govern your use of GreedHunter's gaming platform and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300">
                  By creating an account or using GreedHunter, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <h2 className="text-2xl font-bold mb-4">2. User Eligibility</h2>
                <ul className="text-gray-300 space-y-2 ml-9">
                  <li>You must be at least 13 years old to use our services</li>
                  <li>You must be at least 18 years old or the age of majority in your jurisdiction to participate in real-money gaming</li>
                  <li>You must provide accurate and complete information when creating your account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <h2 className="text-2xl font-bold mb-4">3. Gaming and Rewards</h2>
                <ul className="text-gray-300 space-y-2 ml-9">
                  <li>GreedTokens (GT) are earned through gameplay and can be used within the platform</li>
                  <li>Token values may fluctuate and are not guaranteed</li>
                  <li>We reserve the right to modify reward structures at any time</li>
                  <li>Cheating, hacking, or exploiting bugs is strictly prohibited</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#ffd700]" />
                  <h2 className="text-2xl font-bold">4. Prohibited Activities</h2>
                </div>
                <p className="text-gray-300 mb-4">You agree not to:</p>
                <ul className="text-gray-300 space-y-2 ml-9">
                  <li>Use the platform for any illegal purposes</li>
                  <li>Attempt to hack, modify, or reverse engineer our systems</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Share your account with others</li>
                  <li>Use bots, scripts, or automated tools</li>
                  <li>Manipulate game outcomes or rankings</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <h2 className="text-2xl font-bold mb-4">5. Account Termination</h2>
                <p className="text-gray-300">
                  We reserve the right to suspend or terminate your account at any time for violations of these Terms. Upon termination, your access to the platform will be revoked, and any unused tokens may be forfeited.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <h2 className="text-2xl font-bold mb-4">6. Disclaimers</h2>
                <p className="text-gray-300">
                  GreedHunter is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service or the accuracy of game outcomes. Your use of the platform is at your own risk.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#ffd700]/20"
              >
                <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
                <p className="text-gray-300 mb-4">
                  For questions about these Terms, please contact us:
                </p>
                <div className="text-[#ffd700]">
                  <p>Email: legal@greedhunter.com</p>
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

export default TermsAndConditions;
