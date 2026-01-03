import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Events", href: "#events" },
  { name: "Leaderboard", href: "#leaderboard" },
  { name: "GreedStore", href: "#store" },
  { name: "About", href: "#about" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-[#00ff88] hover:bg-[#00ff88]/10 rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a0a0f] border-l border-[#00ff88]/30 z-50 md:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#00ff88]/20">
                <h2 className="text-xl font-black">
                  <span className="text-[#00ff88] neon-glow">GREED</span>
                  <span className="text-[#00d9ff] neon-glow">HUNTER</span>
                </h2>
                <button
                  onClick={closeMenu}
                  className="p-2 text-[#00ff88] hover:bg-[#00ff88]/10 rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={link.href}
                        onClick={closeMenu}
                        className="block px-4 py-3 text-gray-300 hover:text-[#00ff88] hover:bg-[#00ff88]/10 rounded-lg transition-all"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* CTA Buttons */}
              <div className="p-4 space-y-3 border-t border-[#00ff88]/20">
                <button className="w-full px-4 py-3 border-2 border-[#00ff88] text-[#00ff88] rounded-md hover:bg-[#00ff88] hover:text-[#0a0a0f] transition-all">
                  Login
                </button>
                <button className="w-full px-4 py-3 bg-[#00ff88] text-[#0a0a0f] rounded-md hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] transition-all">
                  Sign Up
                </button>
              </div>

              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#00ff88]/5 to-transparent pointer-events-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
