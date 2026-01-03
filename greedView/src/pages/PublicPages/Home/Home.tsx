import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from './Hero';
import { EventShowcase } from './EventShowcase';
import { GreedStore } from './GreedStore';
import { Leaderboard } from './Leaderboard';
import { CoinsRewards } from './CoinsRewards';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import { AnimatedBackground } from './AnimatedBackground';
import { SectionDivider } from './SectionDivider';
import { MobileMenu } from './MobileMenu';

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#00ff88]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <h1 className="text-xl sm:text-2xl font-black">
                  <span className="text-[#00ff88] neon-glow">GREED</span>
                  <span className="text-[#00d9ff] neon-glow">HUNTER</span>
                </h1>
              </div>

              {/* Nav Links - Desktop */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#events" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  Events
                </a>
                <a href="#leaderboard" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  Leaderboard
                </a>
                <a href="#store" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  GreedStore
                </a>
                <a href="#about" className="text-gray-300 hover:text-[#00ff88] transition-colors">
                  About
                </a>
              </div>

              {/* CTA Buttons & Mobile Menu */}
              <div className="flex items-center gap-3">
                <Link to="/auth/login">
                  <button className="hidden sm:block px-4 py-2 text-sm border-2 border-[#00ff88] text-[#00ff88] rounded-md hover:bg-[#00ff88] hover:text-[#0a0a0f] transition-all">
                    Login
                  </button>
                </Link>
                <Link to="/auth/register">
                  <button className="hidden md:block px-4 py-2 text-sm bg-[#00ff88] text-[#0a0a0f] rounded-md hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] transition-all">
                    Sign Up
                  </button>
                </Link>
                <MobileMenu />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Hero />
          
          <SectionDivider color="#00ff88" />
          
          <div id="events">
            <EventShowcase />
          </div>
          
          <SectionDivider color="#00d9ff" />
          
          <div id="store">
            <GreedStore />
          </div>
          
          <SectionDivider color="#8b5cf6" />
          
          <div id="leaderboard">
            <Leaderboard />
          </div>
          
          <SectionDivider color="#ffd700" />
          
          <CoinsRewards />
          
          <SectionDivider color="#ff0055" />
          
          <div id="about">
            <Testimonials />
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#00ff88] text-[#0a0a0f] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] transition-all z-40 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Home;