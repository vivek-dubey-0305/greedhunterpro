import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    { name: "About GreedHunter", href: "/about" },
    { name: "How It Works", href: "#events" },
    { name: "Event Calendar", href: "#events" },
    { name: "Leaderboards", href: "#leaderboard" },
  ],
  Events: [
    { name: "Search Hunt", href: "#events" },
    { name: "Quiz Battles", href: "#events" },
    { name: "Scavenger Hunt", href: "#events" },
    { name: "Speed Run", href: "#events" },
    { name: "Virtual Arena", href: "#events" },
  ],
  Resources: [
    { name: "GreedStore", href: "#store" },
    { name: "Coin System", href: "#events" },
    { name: "Help Center", href: "/faq" },
    { name: "Community Guidelines", href: "/faq" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-and-conditions" },
    { name: "Cookie Policy", href: "/privacy-policy" },
    { name: "Contact Us", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", color: "#00d9ff" },
  { icon: Instagram, href: "#", color: "#ff0055" },
  { icon: Youtube, href: "#", color: "#ff0000" },
  { icon: Github, href: "#", color: "#00ff88" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0f] border-t border-[#00ff88]/20 overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-5"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black mb-4">
                <span className="text-[#00ff88] neon-glow">GREED</span>
                <span className="text-[#00d9ff] neon-glow">HUNTER</span>
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Where reality meets virtual competition. Hunt, compete, and rise to the top.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-[#141420] border border-white/10 flex items-center justify-center group transition-all hover:scale-110"
                    whileHover={{ y: -3 }}
                    style={{ borderColor: social.color + '30' }}
                  >
                    <social.icon 
                      className="w-5 h-5 text-gray-400 group-hover:text-current transition-colors"
                      style={{ color: social.color }}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h4 className="text-white font-bold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm inline-block relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-[#00ff88] group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm inline-block relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-[#00ff88] group-hover:w-full transition-all duration-300"></span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="mb-12 bg-gradient-to-r from-[#00ff88]/10 to-[#00d9ff]/10 rounded-2xl p-6 sm:p-8 border border-[#00ff88]/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Stay in the Loop</h4>
              <p className="text-gray-400 text-sm">
                Get updates on new events, exclusive challenges, and special rewards.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow sm:w-64 px-4 py-3 bg-[#141420] border border-[#00ff88]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
              <motion.button
                className="px-6 py-3 bg-[#00ff88] text-[#0a0a0f] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00ff88]" />
            <span>Operating Globally</span>
          </div>

          <div className="text-center">
            © {new Date().getFullYear()} GreedHunter. All rights reserved. Built for hunters, by hunters.
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00d9ff]" />
            <a href="mailto:support@greedhunter.io" className="hover:text-[#00d9ff] transition-colors">
              support@greedhunter.io
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00d9ff]/5 rounded-full blur-3xl -z-10"></div>
      </div>
    </footer>
  );
}
