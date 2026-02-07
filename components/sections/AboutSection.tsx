"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AboutSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const skills = {
    languages: ["C++", "JavaScript", "HTML", "CSS", "Python"],
    frameworks: ["Node.js", "Next.js", "Tailwind CSS"],
    tools: ["Git & GitHub", "Vercel", "VS Code"],
    concepts: ["Responsive Design", "SEO Optimization", "API Integration", "Performance & Accessibility"]
  };

  return (
    <section id="about" className="py-12 md:py-24 relative">
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-mesh opacity-10 -z-10" />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            About <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto mb-4 rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Professional Journey
              </h3>
              <p className="text-white/80 leading-relaxed mb-4">
                I am <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent font-semibold">Miftahul Hussain</span>, a passionate web developer who enjoys building fast, structured, and visually clean websites and web applications.
              </p>
              <p className="text-white/80 leading-relaxed">
                I focus on writing maintainable code, creating intuitive user interfaces, and delivering production-ready projects. Continuously improving my skills, I aim to grow as a software engineer while creating meaningful digital products.
              </p>
            </div>

            {/* Experience */}
            <div className="glass rounded-xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Experience
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-accent-purple pl-4">
                  <h4 className="font-semibold text-white">Freelance Web Developer</h4>
                  <p className="text-sm text-accent-purple mb-1">2024 - Present</p>
                  <p className="text-white/70 text-sm">
                    Built and delivered production websites for clients, handling UI design, development, optimization, and deployment.
                  </p>
                </div>
                
                <div className="border-l-2 border-accent-blue pl-4">
                  <h4 className="font-semibold text-white">Education</h4>
                  <p className="text-sm text-accent-blue mb-1">Senior Secondary</p>
                  <p className="text-white/70 text-sm">
                    Focused on Computer Science and Software Development fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="glass rounded-xl p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 capitalize">
                  {category.replace(/([A-Z])/g, ' $1')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/90 hover:bg-white/10 transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}