"use client";

import { motion } from "framer-motion";
import SocialLinks from "@/components/ui/SocialLinks";
import Link from "next/link";

const WORDMARK = [
  { c: "M", color: "#D4FF3A" },
  { c: "i", color: "#FF3D8B" },
  { c: "f", color: "#FFC83D" },
  { c: "t", color: "#F4F1FF" },
  { c: "a", color: "#D4FF3A" },
  { c: ".", color: "#F4F1FF" },
  { c: "d", color: "#FF3D8B" },
  { c: "e", color: "#FFC83D" },
  { c: "v", color: "#D4FF3A" },
];

export default function Footer() {
  return (
    <footer className="relative mt-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="max-w-[24ch] font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-bone md:text-5xl">
              Crafting digital experiences with passion
            </p>
            <SocialLinks className="mt-8" />
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end">
            {["Home", "Projects", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="group relative text-base font-bold text-bone/70 transition-colors hover:text-lime"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-lime transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Every letter hops when you hover it */}
      <div
        aria-hidden="true"
        className="flex select-none justify-center overflow-hidden pb-2 font-display text-[clamp(4rem,19vw,17rem)] font-extrabold leading-[0.85] tracking-[-0.05em]"
        style={{ fontVariationSettings: '"wdth" 80' }}
      >
        {WORDMARK.map((l, i) => (
          <motion.span
            key={i}
            whileHover={{ y: -28, rotate: i % 2 ? 7 : -7, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="inline-block cursor-default"
            style={{ color: l.color }}
          >
            {l.c}
          </motion.span>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Mifta.dev • Built with Next.js & Framer Motion
        </p>
      </div>
    </footer>
  );
}
