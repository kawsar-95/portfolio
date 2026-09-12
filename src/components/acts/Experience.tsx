"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { MISSIONS, type Mission } from "@/lib/data";

const TONE_STYLES: Record<Mission["envTone"], { text: string; dot: string; border: string }> = {
  prod: { text: "text-go", dot: "bg-go", border: "border-go/40" },
  stage: { text: "text-amber", dot: "bg-amber", border: "border-amber/40" },
  cert: { text: "text-invert", dot: "bg-invert", border: "border-invert/40" },
  dev: { text: "text-dust", dot: "bg-dust", border: "border-dust/40" },
};

/**
 * ACT IV — RUN. A career is a series of test runs across environments:
 * academy → sandbox → staging → production.
 */
export default function Experience() {
  return (
    <section id="run" className="relative px-5 py-32 md:px-12 md:py-44 lg:px-24">
      <SectionTitle
        act="ACT IV"
        title="RUN"
        log="Before a release reaches production, it survives staging. So did every role that got me here."
      />

      <div className="relative mx-auto max-w-5xl">
        {/* the rail */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-go via-amber to-faint md:left-[9px]"
        />

        <div className="space-y-20">
          {MISSIONS.map((m, i) => {
            const tone = TONE_STYLES[m.envTone];
            const featured = m.log.length > 0;
            return (
              <motion.article
                key={m.role + m.org}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10 md:pl-16"
              >
                {/* node */}
                <span
                  className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-void ${tone.dot} ${m.envTone === "prod" ? "animate-pulse-soft" : ""}`}
                />

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    className={`border px-2.5 py-1 font-mono text-[9px] tracking-[0.3em] ${tone.text} ${tone.border}`}
                  >
                    {m.env}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-faint">
                    {m.period}
                  </span>
                </div>

                <h3 className="display-xl mt-4 text-3xl text-bone md:text-5xl">
                  {m.role}
                </h3>
                <div className="mt-1 font-mono text-xs tracking-[0.25em] text-amber md:text-sm">
                  @ {m.org}
                </div>

                <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-bone/75 md:text-base">
                  {m.brief}
                </p>

                {featured && (
                  <ul className="mt-6 space-y-2.5 border-l border-faint/40 pl-5">
                    {m.log.map((entry) => (
                      <li
                        key={entry.slice(0, 40)}
                        className="font-mono text-[11px] leading-relaxed text-dust md:text-xs"
                      >
                        <span className={`mr-2 ${tone.text}`}>▸</span>
                        {entry}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
