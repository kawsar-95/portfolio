"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import LogLine from "@/components/LogLine";
import { IDENTITY } from "@/lib/data";
import { useTheme } from "@/components/ThemeProvider";

const Gargantua = dynamic(() => import("@/components/three/Gargantua"), {
  ssr: false,
});

const CHANNELS = [
  { label: "EMAIL", value: IDENTITY.email, href: `mailto:${IDENTITY.email}`, cmd: "mail -s" },
  { label: "GITHUB", value: `github.com/${IDENTITY.githubHandle}`, href: IDENTITY.github, cmd: "git clone" },
  { label: "LINKEDIN", value: "Nuruddin Kawsar", href: IDENTITY.linkedin, cmd: "curl -L" },
  { label: "WEB", value: "nuruddinkawsar.me", href: IDENTITY.site, cmd: "ping" },
];

/**
 * ACT VII — SIGNOFF. The event horizon of the whole journey.
 * Every test run ends here: something real, verified, reachable.
 */
export default function Contact() {
  const { theme } = useTheme();
  return (
    <section
      id="signoff"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Gargantua hangs behind everything */}
      <div className="absolute inset-0">
        <Gargantua theme={theme} />
      </div>
      <div className="contact-vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-36 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-4 flex items-center gap-4"
        >
          <span className="kicker text-amber">ACT VII</span>
          <span className="h-px w-14 bg-faint" />
          <span className="kicker">SIGNOFF</span>
        </motion.div>

        <motion.div
          className="overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl glow-amber text-[clamp(4rem,15vw,14rem)] text-bone"
          >
            APPROVED ✓
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="crt term-shadow terminal-shell relative mt-6 w-full max-w-lg overflow-hidden bg-carbon text-left"
        >
          <div className="flex items-center gap-2 border-b border-bone/8 bg-steel/60 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-danger/80" />
            <span className="h-2 w-2 rounded-full bg-amber/80" />
            <span className="h-2 w-2 rounded-full bg-go/80" />
            <span className="ml-1 font-mono text-[9px] tracking-[0.25em] text-dust">sign-off.log</span>
          </div>
          <div className="px-4 py-4 md:px-5">
            <LogLine
              text="Every test suite ends in a report. This one ends with you and me, deciding what ships next."
              startDelay={500}
            />
          </div>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          href={`mailto:${IDENTITY.email}?subject=Let%27s%20talk%20QA`}
          data-cursor="SEND"
          className="group mt-10 inline-flex items-center gap-4 border border-amber/50 bg-void/60 px-8 py-4 font-mono text-xs tracking-[0.25em] text-amber backdrop-blur-sm transition-all duration-500 hover:border-amber hover:bg-amber hover:text-void md:text-sm"
        >
          <span className="text-go transition-colors group-hover:text-void">$</span>
          sign-off --approve
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </motion.a>

        {/* channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-px bg-faint/30 sm:grid-cols-2"
        >
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="group flex items-center justify-between bg-void/80 px-5 py-4 backdrop-blur-sm transition-colors duration-400 hover:bg-steel/80"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-dust transition-colors group-hover:text-amber">
                {c.label}
              </span>
              <span className="font-mono text-[11px] text-bone/70 transition-colors group-hover:text-bone">
                {c.value} <span className="text-faint transition-colors group-hover:text-amber">↗</span>
              </span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* footer */}
      <footer className="relative z-10 border-t border-bone/8 bg-void/70 px-5 pb-20 pt-6 backdrop-blur-sm md:px-12 lg:pb-6">
        <div className="flex flex-col items-center justify-between gap-3 text-center font-mono text-[9px] tracking-[0.25em] text-faint md:flex-row md:text-left">
          <span>© 2026 NURUDDIN KAWSAR</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1 w-1 animate-pulse-soft rounded-full bg-go" />
            ALL SUITES PASSING — TESTED FROM DHAKA
          </span>
          <span>build v2026.9.13 · sqa-verified</span>
        </div>
      </footer>
    </section>
  );
}
