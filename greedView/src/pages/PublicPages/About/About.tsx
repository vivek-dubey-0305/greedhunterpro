import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Users, Zap, Trophy, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
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
              className="absolute w-2 h-2 bg-[#00ff88] rounded-full opacity-60"
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
              About <span className="text-[#00ff88]">GreedHunter</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8">
              The Ultimate Gaming Experience in the GreedVerse
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Our <span className="text-[#00d9ff]">Mission</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              GreedHunter is more than just a game platform. We're building a revolutionary ecosystem where gamers can compete, earn, and thrive in the ultimate digital arena. Our mission is to create the most immersive and rewarding gaming experience ever conceived.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Competitive Gaming",
                description: "Engage in high-stakes competitions with players worldwide in our cutting-edge gaming arenas."
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Join a vibrant community of gamers, developers, and enthusiasts shaping the future of gaming."
              },
              {
                icon: Zap,
                title: "Instant Rewards",
                description: "Earn real value through our innovative reward system powered by blockchain technology."
              },
              {
                icon: Trophy,
                title: "Achievement System",
                description: "Climb the leaderboards and unlock exclusive rewards as you prove your gaming prowess."
              },
              {
                icon: Gamepad2,
                title: "Diverse Games",
                description: "Experience a wide variety of games from strategy to action, all optimized for maximum fun."
              },
              {
                icon: Trophy,
                title: "NFT Integration",
                description: "Own unique digital assets and trade them in our integrated marketplace."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#141420] p-6 rounded-lg border border-[#00ff88]/20 hover:border-[#00ff88]/40 transition-all"
              >
                <feature.icon className="w-12 h-12 text-[#00ff88] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#141420]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-12">
              By the <span className="text-[#00ff88]">Numbers</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Active Players" },
                { number: "500+", label: "Games Available" },
                { number: "1M+", label: "Rewards Distributed" },
                { number: "24/7", label: "Support Available" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-black text-[#00ff88] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
