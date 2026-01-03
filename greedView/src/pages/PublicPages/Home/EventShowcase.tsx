import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import { Search, Brain, MapPin, Zap, Crosshair, Target, Flag, Gamepad2 } from "lucide-react";

const events = [
  {
    title: "Search Hunt",
    description: "Decode clues, find hidden targets across the digital realm. Speed and precision are your weapons.",
    icon: Search,
    color: "#00ff88",
    difficulty: "Medium",
    participants: "2.4K",
  },
  {
    title: "Quiz Battles",
    description: "Test your knowledge in real-time combat. Every second counts, every answer matters.",
    icon: Brain,
    color: "#00d9ff",
    difficulty: "Easy",
    participants: "5.1K",
  },
  {
    title: "Scavenger Hunt",
    description: "Navigate virtual and physical worlds. Collect items, solve puzzles, claim victory.",
    icon: MapPin,
    color: "#8b5cf6",
    difficulty: "Hard",
    participants: "3.8K",
  },
  {
    title: "Speed Run",
    description: "Race against time and rivals. Complete challenges faster than anyone else.",
    icon: Zap,
    color: "#ffd700",
    difficulty: "Extreme",
    participants: "1.9K",
  },
  {
    title: "Virtual Kill Arena",
    description: "Enter the combat zone. Eliminate targets, survive the chaos, dominate the arena.",
    icon: Crosshair,
    color: "#ff0055",
    difficulty: "Expert",
    participants: "4.2K",
  },
  {
    title: "Sniper Zone",
    description: "Precision is everything. Long-range challenges that test patience and accuracy.",
    icon: Target,
    color: "#00ffcc",
    difficulty: "Hard",
    participants: "2.7K",
  },
  {
    title: "Capture the Flag",
    description: "Team-based warfare. Strategy, coordination, and speed determine the winner.",
    icon: Flag,
    color: "#ff6b00",
    difficulty: "Medium",
    participants: "3.3K",
  },
  {
    title: "Rush Mode",
    description: "Chaos unleashed. Fast-paced action where only the quickest survive.",
    icon: Gamepad2,
    color: "#ff00ff",
    difficulty: "Extreme",
    participants: "1.5K",
  },
];

export function EventShowcase() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]"></div>
      
      {/* Animated background lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
            style={{ top: `${20 + i * 20}%`, width: '100%' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full text-[#00ff88] text-sm">
              MISSION BRIEFINGS
            </div>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="text-white">Choose Your </span>
            <span className="text-[#00ff88] neon-glow">Battle</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Multiple arenas, infinite challenges. Pick your game mode and prove your skills.
          </p>
        </motion.div>

        {/* Event Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-sm">
            More game modes unlocking soon. Stay tuned, hunter.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
