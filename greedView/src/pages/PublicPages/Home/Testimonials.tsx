import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex \"CyberNinja\" Kim",
    avatar: "CN",
    title: "Speed Run Champion",
    rating: 5,
    text: "GreedHunter changed the game for me. The adrenaline rush from competing in real-time events is unmatched. Already redeemed 3 gift cards!",
    color: "#00ff88",
  },
  {
    name: "Maya \"PhantomQueen\" Rodriguez",
    avatar: "PQ",
    title: "Quiz Battle Master",
    rating: 5,
    text: "The anime-inspired interface is absolutely stunning. Every hunt feels like entering a new dimension. Plus, the rewards are legit!",
    color: "#00d9ff",
  },
  {
    name: "Jordan \"VoidHunter\" Chen",
    avatar: "VH",
    title: "Arena Veteran",
    rating: 5,
    text: "Best competitive platform I've ever used. The variety of game modes keeps things fresh, and the community is incredibly active.",
    color: "#8b5cf6",
  },
  {
    name: "Sarah \"NeonStrike\" Williams",
    avatar: "NS",
    title: "Scavenger Expert",
    rating: 5,
    text: "Love how GreedHunter merges virtual and real-world challenges. It's not just gaming—it's a lifestyle. The leaderboard grind is real!",
    color: "#ff0055",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#0a0a0f] to-[#0f0f1a]"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#00d9ff]/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="px-4 py-2 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-sm">
              HUNTER TESTIMONIALS
            </div>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="text-white">What </span>
            <span className="text-[#8b5cf6] neon-glow">Hunters</span>
            <span className="text-white"> Say</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of hunters conquering the GreedVerse every day.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur-2xl"
                style={{ backgroundColor: testimonial.color }}
              />

              {/* Card */}
              <div className="relative bg-[#141420]/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 transition-all overflow-hidden"
                style={{ borderColor: testimonial.color + '30' }}
              >
                {/* Quote icon */}
                <Quote 
                  className="absolute top-4 right-4 w-12 h-12 opacity-10"
                  style={{ color: testimonial.color }}
                />

                {/* Avatar and Info */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                    style={{ 
                      borderColor: testimonial.color,
                      backgroundColor: testimonial.color + '20'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span 
                      className="text-xl font-black"
                      style={{ color: testimonial.color }}
                    >
                      {testimonial.avatar}
                    </span>
                  </motion.div>

                  {/* Name and Title */}
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-white mb-1">
                      {testimonial.name}
                    </h4>
                    <p 
                      className="text-sm mb-2"
                      style={{ color: testimonial.color }}
                    >
                      {testimonial.title}
                    </p>

                    {/* Rating */}
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15 + i * 0.05 }}
                        >
                          <Star 
                            className="w-4 h-4 fill-current"
                            style={{ color: testimonial.color }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Bottom accent */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${testimonial.color}, transparent)`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-8 bg-[#141420]/50 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
            <div>
              <div className="text-3xl font-black text-[#00ff88]">4.9/5</div>
              <div className="text-xs text-gray-500">Avg Rating</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-3xl font-black text-[#00d9ff]">50K+</div>
              <div className="text-xs text-gray-500">Active Users</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-3xl font-black text-[#8b5cf6]">1M+</div>
              <div className="text-xs text-gray-500">Hunts Completed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
