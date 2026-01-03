import { motion } from "framer-motion";
import { ShoppingCart, Gift, Smartphone, Headphones, Shirt, Award } from "lucide-react";
import { NeonButton } from "./NeonButton";

const storeItems = [
  {
    name: "Amazon Gift Card",
    price: "5000",
    icon: Gift,
    color: "#00ff88",
    tag: "Popular",
  },
  {
    name: "Gaming Headset",
    price: "15000",
    icon: Headphones,
    color: "#00d9ff",
    tag: "Tech",
  },
  {
    name: "Premium Smartphone",
    price: "50000",
    icon: Smartphone,
    color: "#8b5cf6",
    tag: "Exclusive",
  },
  {
    name: "Anime Merch Bundle",
    price: "8000",
    icon: Shirt,
    color: "#ff0055",
    tag: "Limited",
  },
  {
    name: "GreedHunter Pro Badge",
    price: "2500",
    icon: Award,
    color: "#ffd700",
    tag: "Premium",
  },
];

export function GreedStore() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]"></div>
      
      {/* Holographic grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="cyber-grid h-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
              <span className="text-[#00d9ff] neon-glow">GREED</span>
              <span className="text-white">STORE</span>
            </h2>
          </motion.div>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Convert your GreedCoins into real rewards. From gift cards to exclusive gear, 
            the spoils of victory await.
          </p>

          {/* Coin Balance Display */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00ff88]/20 to-[#00d9ff]/20 border-2 border-[#00ff88]/30 rounded-full px-6 py-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-full bg-[#00ff88] flex items-center justify-center">
              <span className="text-[#0a0a0f] font-black">G</span>
            </div>
            <div>
              <div className="text-xs text-gray-400">Your Balance</div>
              <div className="text-xl font-black text-[#00ff88]">12,450 COINS</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Store Items - Vending Machine Style */}
        <div className="relative">
          {/* Vending machine frame */}
          <div className="bg-gradient-to-b from-[#141420] to-[#0f0f1a] rounded-2xl p-8 border-2 border-[#00ff88]/30 shadow-2xl">
            {/* Top panel */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#00ff88]/20">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-[#00ff88]" />
                <span className="text-xl font-bold text-white">REWARD TERMINAL</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#00ff88]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {storeItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Tag */}
                  <div 
                    className="absolute -top-2 -right-2 z-10 px-2 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-[#0a0a0f]">{item.tag}</span>
                  </div>

                  {/* Item Card */}
                  <div className="bg-[#1a1a2e] rounded-lg p-6 border-2 border-transparent group-hover:border-current transition-all h-full flex flex-col"
                    style={{ borderColor: item.color + '40' }}
                  >
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: item.color + '20' }}
                    >
                      <item.icon className="w-8 h-8" style={{ color: item.color }} />
                    </div>

                    {/* Name */}
                    <h4 className="text-white text-center mb-2 flex-grow">
                      {item.name}
                    </h4>

                    {/* Price */}
                    <div className="text-center">
                      <div className="text-2xl font-black mb-3" style={{ color: item.color }}>
                        {item.price}
                      </div>
                      <button
                        className="w-full px-4 py-2 rounded-md border-2 transition-all text-sm"
                        style={{ 
                          borderColor: item.color,
                          color: item.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = item.color;
                          e.currentTarget.style.color = '#0a0a0f';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = item.color;
                        }}
                      >
                        REDEEM
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom info */}
            <div className="text-center text-gray-500 text-sm">
              More items added weekly. Check back for exclusive drops.
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-[#00ff88]/5 rounded-2xl blur-3xl -z-10"></div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <NeonButton variant="primary" size="lg">
            Browse Full Store
          </NeonButton>
        </motion.div>
      </div>
    </section>
  );
}
