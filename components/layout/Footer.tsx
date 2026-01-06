"use client";

import { motion } from "framer-motion";
import SocialLinks from "@/components/ui/SocialLinks";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10 pt-8">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8">
          {/* Left: Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <Link href="/" className="group">
              <h3 className="font-display text-2xl font-bold">
                <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                  Mifta
                </span>
                <span className="text-white/90">.dev</span>
              </h3>
              <p className="text-sm text-white/60 mt-2 group-hover:text-white/80 transition-colors">
                Crafting digital experiences with passion
              </p>
            </Link>
          </motion.div>

          {/* Middle: Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <SocialLinks />
          </motion.div>

          {/* Right: Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {["Home", "Projects", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Bottom: Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="py-6 border-t border-white/10 text-center"
        >
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Mifta.dev • Built with Next.js & Framer Motion
          </p>
          <p className="text-xs text-white/30 mt-2">
            Crafted with ❤️ by a developer, for developers
          </p>
        </motion.div>
      </div>
    </footer>
  );
}