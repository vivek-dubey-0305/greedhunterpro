import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
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
              className="absolute w-2 h-2 bg-[#00d9ff] rounded-full opacity-60"
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Get in <span className="text-[#00d9ff]">Touch</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              Ready to join the GreedHunter revolution? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                Contact <span className="text-[#00d9ff]">Information</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email Us",
                    content: "support@greedhunter.com",
                    description: "For general inquiries and support"
                  },
                  {
                    icon: MessageSquare,
                    title: "Live Chat",
                    content: "Available 24/7",
                    description: "Get instant help from our team"
                  },
                  {
                    icon: Phone,
                    title: "Phone Support",
                    content: "+1 (555) 123-4567",
                    description: "Call us for urgent matters"
                  },
                  {
                    icon: MapPin,
                    title: "Office",
                    content: "123 Gaming Street, Digital City",
                    description: "Visit our headquarters"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-[#141420] rounded-lg border border-[#00d9ff]/20"
                  >
                    <item.icon className="w-8 h-8 text-[#00d9ff] mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-[#00d9ff] font-medium">{item.content}</p>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-[#141420] p-8 rounded-lg border border-[#00d9ff]/20"
            >
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00d9ff]/30 rounded-md focus:border-[#00d9ff] focus:outline-none text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00d9ff]/30 rounded-md focus:border-[#00d9ff] focus:outline-none text-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00d9ff]/30 rounded-md focus:border-[#00d9ff] focus:outline-none text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00d9ff]/30 rounded-md focus:border-[#00d9ff] focus:outline-none text-white"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#00d9ff]/30 rounded-md focus:border-[#00d9ff] focus:outline-none text-white resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#00d9ff] text-[#0a0a0f] py-3 px-6 rounded-md font-semibold hover:shadow-[0_0_20px_rgba(0,217,255,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
