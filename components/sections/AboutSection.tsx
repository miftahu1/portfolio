"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Tilt from "@/components/ui/Tilt";
import VelocityMarquee from "@/components/ui/VelocityMarquee";

type Group = { category: string; items: string[]; bg: string; fg: string; span: string };

const groups: Group[] = [
  { category: "languages", items: ["C++", "JavaScript", "HTML", "CSS", "Python"], bg: "#0B0B14", fg: "#D4FF3A", span: "sm:col-span-2" },
  { category: "frameworks", items: ["Node.js", "Next.js", "Tailwind CSS"], bg: "#FF3D8B", fg: "#0B0B14", span: "" },
  { category: "tools", items: ["Git & GitHub", "Vercel", "VS Code"], bg: "#3626FF", fg: "#F4F1FF", span: "" },
  { category: "concepts", items: ["Responsive Design", "SEO Optimization", "API Integration", "Performance & Accessibility"], bg: "#FFC83D", fg: "#0B0B14", span: "sm:col-span-2" },
];

const allSkills = groups.flatMap((g) => g.items);

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 -mt-10 rounded-[40px] bg-lime text-ink"
      style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 md:pt-28">
        <SectionHeading title="About Me" tone="dark" />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Story stays pinned while the details scroll past */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }}
            className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
          >
            <h3 className="mb-5 text-sm font-bold text-ink/70">Professional Journey</h3>
            <p className="font-display text-2xl font-bold leading-snug tracking-tight md:text-4xl">
              I am Miftahul Hussain, a passionate web developer who enjoys building fast, structured, and visually clean websites and web applications.
            </p>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink/80 md:text-lg">
              I focus on writing maintainable code, creating intuitive user interfaces, and delivering production-ready projects. Continuously improving my skills, I aim to grow as a software engineer while creating meaningful digital products.
            </p>
          </motion.div>

          <div className="space-y-14 lg:col-span-7">
            {/* Experience is a real sequence, so it gets a rail */}
            <div>
              <h3 className="mb-8 text-sm font-bold text-ink/70">Experience</h3>
              <ol className="relative space-y-10 border-l-2 border-ink pl-8">
                <li className="relative">
                  <span className="absolute -left-[41px] top-2 h-4 w-4 rounded-full border-2 border-ink bg-pink" />
                  <h4 className="font-display text-2xl font-extrabold">Freelance Web Developer</h4>
                  <p className="mt-1 inline-block rounded-full bg-ink px-3 py-0.5 text-sm font-semibold text-lime">2024 - Present</p>
                  <p className="mt-3 max-w-[52ch] text-ink/80">
                    Built and delivered production websites for clients, handling UI design, development, optimization, and deployment.
                  </p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[41px] top-2 h-4 w-4 rounded-full border-2 border-ink bg-electric" />
                  <h4 className="font-display text-2xl font-extrabold">Education</h4>
                  <p className="mt-1 inline-block rounded-full bg-ink px-3 py-0.5 text-sm font-semibold text-lime">Senior Secondary</p>
                  <p className="mt-3 max-w-[52ch] text-ink/80">
                    Focused on Computer Science and Software Development fundamentals.
                  </p>
                </li>
              </ol>
            </div>

            {/* Skills: colour tiles that tilt toward the pointer */}
            <div className="grid gap-5 sm:grid-cols-2">
              {groups.map((group, idx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 50, rotate: idx % 2 ? 3 : -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: "spring", stiffness: 100, damping: 14, delay: idx * 0.08 }}
                  className={group.span}
                >
                  <Tilt max={7} className="h-full rounded-[28px]">
                    <div
                      className="h-full rounded-[28px] border-2 border-ink p-6 shadow-[6px_6px_0_0_#0B0B14] transition-shadow duration-300 hover:shadow-[10px_10px_0_0_#0B0B14]"
                      style={{ background: group.bg, color: group.fg }}
                    >
                      <h3 className="mb-4 font-display text-2xl font-extrabold capitalize">{group.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <motion.span
                            key={skill}
                            whileHover={{ scale: 1.1, rotate: -3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 14 }}
                            className="cursor-default rounded-full border-2 border-current px-3 py-1 text-sm font-semibold"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </Tilt>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticker-tape marquee: every skill, skews with scroll speed */}
      <div aria-hidden="true" className="relative -mb-6 pb-10">
        <div className="-rotate-2 border-y-2 border-ink bg-ink py-4">
          <VelocityMarquee baseSpeed={5}>
            {allSkills.map((skill, i) => (
              <span key={i} className="flex items-center font-display text-3xl font-extrabold text-lime md:text-5xl">
                <span className="px-6">{skill}</span>
                <span className="text-pink">✦</span>
              </span>
            ))}
          </VelocityMarquee>
        </div>
      </div>
    </section>
  );
}
