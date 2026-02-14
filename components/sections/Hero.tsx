'use client';

import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import InfoCard from "@/components/ui/InfoCard";
import { Code, Users, Award, Terminal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  // Terminal content sequences
  const sequences = [
    {
      lines: [
        "> whoami",
        "Miftahul Hussain",
        "> skills --list",
        "  • React/Next.js",
        "  • TypeScript",
        "  • Node.js",
        "  • TailwindCSS",
      ]
    },
    {
      lines: [
        "> npm create mifta-app",
        "Creating a new Mifta project...",
        "✅ Done!",
        "> cd portfolio",
        "> npm run dev",
        "Ready on http://localhost:3000",
      ]
    },
    {
      lines: [
        "> git log -1",
        "commit 3a1b2c3",
        "Author: Mifta <mifta@dev>",
        "Date:   today",
        "",
        "    Deploy: interactive terminal",
        "> system info",
        "OS:     Arch Linux",
        "Shell:  zsh 8.1.0",
        "Theme:  cyberpunk",
      ]
    }
  ];

  const currentSequence = sequences[cycleCount % sequences.length];
  const totalLines = currentSequence.lines.length;

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typing animation logic
  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(() => {
      if (currentLineIndex < totalLines) {
        const line = currentSequence.lines[currentLineIndex];
        if (currentCharIndex < line.length) {
          // Still typing current line
          setTerminalLines(prev => {
            const newLines = [...prev];
            if (newLines.length <= currentLineIndex) {
              newLines.push(line.substring(0, currentCharIndex + 1));
            } else {
              newLines[currentLineIndex] = line.substring(0, currentCharIndex + 1);
            }
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Finished current line, move to next
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }
      } else {
        // Finished all lines, pause then restart or cycle
        setTimeout(() => {
          setTerminalLines([]);
          setCurrentLineIndex(0);
          setCurrentCharIndex(0);
          setCycleCount(prev => prev + 1);
        }, 3000);
      }
    }, 50); // typing speed

    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex, currentSequence.lines, totalLines, isTyping, cycleCount]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const subtitle = "Full-Stack Developer";

  return (
    <section className="relative pt-0 md:pt-16 overflow-hidden min-h-[90vh] flex items-center">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-center lg:justify-between gap-8 md:gap-12 py-8 md:py-12">
          {/* Text Content */}
          <div className="lg:w-3/5 space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-3 md:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="text-white">Mifta.</span>
                <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">dev</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gradient bg-gradient-primary bg-clip-text text-transparent"
              >
                {subtitle}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              I design and build clean, modern web experiences with a strong focus on performance, structure, and usability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 pt-2"
            >
              <Link href="/projects" className="w-full sm:w-auto">
                <MagneticButton size={isMobile ? "md" : "lg"} className="w-full sm:w-auto">
                  View Featured Projects
                </MagneticButton>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <MagneticButton variant="ghost" size={isMobile ? "md" : "lg"} className="w-full sm:w-auto">
                  Contact Me
                </MagneticButton>
              </Link>
            </motion.div>
          </div>

          {/* Enhanced Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isMobile ? 0.2 : 0.8, duration: 0.8, ease: "easeOut" }}
            className="lg:w-2/5 order-1 lg:order-2 flex justify-center mt-8 md:mt-0"
          >
            <div className="relative w-72 h-80 sm:w-80 sm:h-88 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
              {/* Glow background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/30 via-cyan-500/30 to-purple-600/30 blur-3xl animate-pulse-slow"></div>
              
              {/* CRT scanline effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="w-full h-full bg-scanlines opacity-10"></div>
              </div>
              
              {/* Terminal window */}
              <div className="relative w-full h-full bg-gray-950/90 backdrop-blur-sm rounded-2xl border border-green-500/30 shadow-2xl shadow-green-500/20 overflow-hidden font-mono">
                {/* Terminal header with interactive buttons */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-green-500/30">
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="w-3 h-3 rounded-full bg-yellow-500/80 cursor-pointer"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    className="w-3 h-3 rounded-full bg-green-500/80 cursor-pointer"
                  />
                  <span className="ml-2 text-xs text-green-400/60 flex-1">mifta@dev:~/portfolio</span>
                  <Terminal size={14} className="text-green-500/50" />
                </div>
                
                {/* Terminal content */}
                <div className="p-4 h-[calc(100%-48px)] overflow-y-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
                  <div className="space-y-1">
                    {terminalLines.map((line, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-sm ${
                          line.startsWith('>') 
                            ? 'text-green-400 font-bold' 
                            : line.startsWith('  •') 
                              ? 'text-cyan-300' 
                              : line.match(/^[a-f0-9]{7,}/) 
                                ? 'text-yellow-300' 
                                : 'text-green-300/80'
                        }`}
                      >
                        {line}
                      </motion.div>
                    ))}
                    {currentLineIndex < totalLines && (
                      <div className="flex items-center text-sm text-green-400">
                        <span className="mr-1">{showCursor ? '█' : ' '}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative matrix rain effect (very subtle) */}
                  <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                    <span className="text-xs text-green-500">01101001</span>
                  </div>
                </div>
                
                {/* Bottom status bar */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-1 bg-gray-900/80 border-t border-green-500/30 text-xs text-green-500/50 flex justify-between">
                  <span>mifta@dev:~/portfolio (zsh)</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    CONNECTED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mt-10 md:mt-16 pt-8 md:pt-12 border-t border-white/10">
          <InfoCard icon={<Code size={20} className="md:w-6 md:h-6" />} title="Modern Tech Stack" description="TypeScript, React, Next.js, and cutting-edge tools for sleek web apps." delay={isMobile ? 0.3 : 0.8} />
          <InfoCard icon={<Users size={20} className="md:w-6 md:h-6" />} title="User-Centric Design" description="Crafting intuitive interfaces that prioritize seamless user experience." delay={isMobile ? 0.4 : 0.9} />
          <InfoCard icon={<Award size={20} className="md:w-6 md:h-6" />} title="Performance Focus" description="Building high-quality, optimized websites for success and speed." delay={isMobile ? 0.5 : 1.0} />
        </div>
      </div>

      <style jsx>{`
        .bg-scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 0, 0.03) 0px,
            rgba(0, 0, 0, 0.5) 1px,
            transparent 2px
          );
          background-size: 100% 4px;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-green-900::-webkit-scrollbar-thumb {
          background-color: #14532d;
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </section>
  );
}
