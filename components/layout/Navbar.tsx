"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home", color: "from-accent-pink to-accent-purple" },
  { href: "/projects", label: "Projects", color: "from-accent-purple to-accent-blue" },
  { href: "/blog", label: "Blog", color: "from-accent-blue to-accent-cyan" },
  { href: "/contact", label: "Contact", color: "from-accent-cyan to-accent-yellow" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 glass border-b border-white/10 shadow-glass"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* LEFT SIDE: Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <AnimatedLogo size={44} />
          <div className="flex flex-col">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-display text-xl font-bold tracking-tight"
            >
              <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                Mifta
              </span>
              <span className="text-white/90">.dev</span>
            </motion.div>
            <motion.span
              className="h-0.5 w-0 bg-gradient-primary group-hover:w-full transition-all duration-300"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
            />
          </div>
        </Link>

        {/* RIGHT SIDE: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 rounded-full glass-strong p-1">
          {links.map((link, index) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-full transition-all duration-300"
              >
                <motion.span
                  className={`relative z-10 text-sm font-medium transition-colors ${
                    active
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </motion.span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${link.color} opacity-90`}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full bg-background-primary shadow-lg md:hidden"
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-4 p-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/80 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}