import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  ScrollText, 
  Shield, 
  Clock, 
  AlertCircle,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  Coins,
  RefreshCcw,
  Ban,
  Scale,
  FileText,
  MessageCircle,
  Mail,
  Sparkles
} from 'lucide-react';

// Policy Section Component
function PolicySection({ 
  icon: Icon, 
  title, 
  content, 
  color,
  isOpen,
  onToggle,
  delay
}: {
  icon: React.ElementType;
  title: string;
  content: string[];
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
        whileHover={{ x: 4 }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <h3 className="text-lg font-bold text-white text-left">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-20">
              <ul className="space-y-3">
                {content.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 text-gray-400"
                  >
                    <CheckCircle className="w-5 h-5 text-[#00ff88] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// FAQ Item Component
function FAQItem({ 
  question, 
  answer, 
  isOpen, 
  onToggle,
  delay
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="border-b border-white/10 last:border-0"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-[#00ff88] transition-colors"
        whileHover={{ x: 4 }}
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="text-[#00ff88] shrink-0"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Important Notice Component
function ImportantNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffd700]/20 to-[#ff8c00]/10 border border-[#ffd700]/30 p-6"
    >
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#ffd700]/20 flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-[#ffd700]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#ffd700] mb-2">Important Notice</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            GreedStore policies are subject to change. We recommend checking this page before making 
            any redemptions. All decisions by GreedHunter regarding coin redemptions are final. 
            For disputes, please contact support within 7 days of the transaction.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Component
export function GreedStorePolicy() {
  const [openSection, setOpenSection] = useState<string | null>('eligibility');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const policies = [
    {
      id: 'eligibility',
      icon: Shield,
      title: 'Eligibility Requirements',
      color: '#00ff88',
      content: [
        'Users must have a verified account to redeem coins.',
        'Minimum account age of 30 days required for cash withdrawals.',
        'Email and phone verification mandatory for all redemptions.',
        'Account must be in good standing with no violations.',
        'KYC verification required for redemptions above ₹5,000 or equivalent.',
      ]
    },
    {
      id: 'conversion',
      icon: Coins,
      title: 'Coin Conversion Rates',
      color: '#ffd700',
      content: [
        'Standard conversion: 100 GreedCoins = ₹1 INR (or equivalent).',
        'Premium members enjoy 10% bonus on all conversions.',
        'Rates may vary based on market conditions and promotions.',
        'Special event coins may have different conversion rates.',
        'Minimum redemption: 1,000 coins for cash, 500 coins for digital items.',
      ]
    },
    {
      id: 'processing',
      icon: Clock,
      title: 'Processing Times',
      color: '#00d9ff',
      content: [
        'Cash withdrawals: 2-5 business days to bank account.',
        'UPI transfers: Usually instant, max 24 hours.',
        'Digital items & perks: Instant activation.',
        'Physical gadgets: 7-14 business days for delivery.',
        'Fee waivers: Applied within 1 hour of redemption.',
      ]
    },
    {
      id: 'refunds',
      icon: RefreshCcw,
      title: 'Refund & Cancellation',
      color: '#8b5cf6',
      content: [
        'Digital redemptions are non-refundable once processed.',
        'Physical item orders can be cancelled within 2 hours.',
        'Defective physical items eligible for replacement only.',
        'Cash withdrawal requests cannot be reversed once initiated.',
        'Coin returns credited within 48 hours for eligible cancellations.',
      ]
    },
    {
      id: 'restrictions',
      icon: Ban,
      title: 'Restrictions & Limits',
      color: '#ff6b6b',
      content: [
        'Maximum 50,000 coins can be redeemed per day.',
        'Cash withdrawal limit: ₹10,000 per week for standard users.',
        'Premium users enjoy 2x higher limits on all redemptions.',
        'One physical gadget redemption per month per category.',
        'Coins earned from referrals have a 60-day maturity period.',
      ]
    },
    {
      id: 'violations',
      icon: Scale,
      title: 'Policy Violations',
      color: '#ff8c00',
      content: [
        'Fraudulent coin acquisition leads to permanent account ban.',
        'Attempted abuse of promotions results in coin forfeiture.',
        'Multiple account usage for redemption is strictly prohibited.',
        'Chargebacks on purchases may result in negative coin balance.',
        'GreedHunter reserves the right to investigate suspicious activities.',
      ]
    }
  ];

  const faqs = [
    {
      id: '1',
      question: 'How long does it take to process a cash withdrawal?',
      answer: 'Cash withdrawals typically take 2-5 business days to reflect in your bank account. UPI transfers are usually instant but may take up to 24 hours in some cases. You can track your withdrawal status in the Wallet section.'
    },
    {
      id: '2',
      question: 'Can I convert my coins back after redeeming for perks?',
      answer: 'No, once coins are redeemed for perks, fee waivers, or any digital items, the transaction is final and cannot be reversed. Please review your redemption carefully before confirming.'
    },
    {
      id: '3',
      question: 'What happens if a physical item is out of stock?',
      answer: 'If an item goes out of stock after your order, you will be notified within 48 hours. You can choose to wait for restock (usually 2-3 weeks) or receive a full coin refund to your account.'
    },
    {
      id: '4',
      question: 'Are there any taxes on coin redemptions?',
      answer: 'Tax implications vary by region. In India, cash withdrawals above ₹10,000 annually may be subject to TDS. We recommend consulting a tax professional for specific advice.'
    },
    {
      id: '5',
      question: 'How do I redeem at a physical GreedStore location?',
      answer: 'Generate a GreedTicket from the Store section, which includes a QR code and verification details. Present this at any GreedStore location for instant verification and redemption.'
    },
    {
      id: '6',
      question: 'Can I gift my coins to another user?',
      answer: 'Currently, direct coin transfers between users are not supported. However, you can gift redeemed digital items or vouchers to others through the gifting feature.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <ScrollText className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-black text-white">Store Policies</h1>
        </div>
        <p className="text-gray-400">
          Everything you need to know about redeeming your GreedCoins
        </p>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Shield, label: 'Secure', sublabel: 'Transactions' },
          { icon: Clock, label: 'Fast', sublabel: 'Processing' },
          { icon: Sparkles, label: 'Transparent', sublabel: 'Policies' },
          { icon: MessageCircle, label: '24/7', sublabel: 'Support' }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center"
          >
            <item.icon className="w-8 h-8 text-[#00ff88] mx-auto mb-2" />
            <p className="text-white font-bold">{item.label}</p>
            <p className="text-gray-500 text-sm">{item.sublabel}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Important Notice */}
      <ImportantNotice />

      {/* Policy Sections */}
      <div className="space-y-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-white flex items-center gap-2"
        >
          <FileText className="w-5 h-5 text-[#00d9ff]" />
          Redemption Policies
        </motion.h2>
        
        {policies.map((policy, index) => (
          <PolicySection
            key={policy.id}
            icon={policy.icon}
            title={policy.title}
            content={policy.content}
            color={policy.color}
            isOpen={openSection === policy.id}
            onToggle={() => setOpenSection(openSection === policy.id ? null : policy.id)}
            delay={0.05 * index}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-[#8b5cf6]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm">Quick answers to common queries</p>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === faq.id}
              onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
              delay={0.05 * index}
            />
          ))}
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#00ff88]/10 to-[#00d9ff]/10 border border-[#00ff88]/30 rounded-2xl p-8 text-center"
      >
        <Mail className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Still Have Questions?</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Our support team is here to help you with any questions about policies or redemptions.
        </p>
        <motion.button
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="w-5 h-5" />
          Contact Support
        </motion.button>
      </motion.div>
    </div>
  );
}
