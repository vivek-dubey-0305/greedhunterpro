import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is GreedHunter?",
      answer: "GreedHunter is a revolutionary gaming platform that combines competitive gaming with blockchain-based rewards. Players can compete in various games, earn tokens, and trade unique digital assets in our integrated marketplace."
    },
    {
      question: "How do I start playing?",
      answer: "Simply create an account, complete your profile, and choose from our wide selection of games. You can start playing immediately and earn rewards from your very first match!"
    },
    {
      question: "What rewards can I earn?",
      answer: "You can earn GreedTokens (GT) through gameplay, tournaments, and achievements. These tokens can be used to purchase in-game items, upgrade your avatar, or traded on our marketplace."
    },
    {
      question: "Is GreedHunter free to play?",
      answer: "Yes! GreedHunter is free to play. You can enjoy most games without any upfront cost. However, some premium features and cosmetic items are available for purchase."
    },
    {
      question: "How does the ranking system work?",
      answer: "Our ranking system is based on your performance across different games. Higher ranks unlock exclusive rewards, tournaments, and special in-game content."
    },
    {
      question: "Can I withdraw my earnings?",
      answer: "Yes, you can withdraw your GreedTokens to various supported wallets. We also offer options to convert tokens to other cryptocurrencies or fiat currency."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-leading encryption and security measures to protect your personal information and digital assets. Your privacy and security are our top priorities."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach our support team through the in-game chat, email us at support@greedhunter.com, or use our 24/7 live chat feature available on our website."
    }
  ];

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
              className="absolute w-2 h-2 bg-[#8b5cf6] rounded-full opacity-60"
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
            <HelpCircle className="w-20 h-20 text-[#8b5cf6] mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Frequently Asked <span className="text-[#8b5cf6]">Questions</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              Everything you need to know about GreedHunter
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#141420] border border-[#8b5cf6]/20 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1a1a2e] transition-colors"
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-[#8b5cf6]" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-300">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16 p-8 bg-[#141420] rounded-lg border border-[#8b5cf6]/20"
          >
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <Link
              to="/contact"
              className="inline-block bg-[#8b5cf6] text-white px-8 py-3 rounded-md font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
