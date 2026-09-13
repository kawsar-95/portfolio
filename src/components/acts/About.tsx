"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import StatusDot from "@/components/StatusDot";
import { STATS } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Giant act-internal statement — the Nolan title-card beat inside ACT II. */
function Principle({
  index,
  lines,
  delay = 0,
}: {
  index: string;
  lines: { text: string; className: string }[];
  delay?: number;
}) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1, delay, ease: EASE }}
      className="mx-auto mt-24 max-w-5xl text-center md:mt-32"
    >
      <div className="kicker mb-6 text-faint">{"// OPERATING PRINCIPLE "}{index}</div>
      {lines.map((l) => (
        <p
          key={l.text}
          className={`display-xl text-[clamp(2.2rem,7vw,5.75rem)] leading-[0.95] ${l.className}`}
        >
          {l.text}
        </p>
      ))}
    </motion.blockquote>
  );
}

/**
 * ACT II — PLAN. Every release has a test plan. This is mine.
 * Narrative sourced from the résumé — no fiction.
 */
export default function About() {
  return (
    <section id="plan" className="relative px-5 py-32 md:px-12 md:py-44 lg:px-24">
      <SectionTitle
        act="ACT II"
        title="PLAN"
        log="Every release has a test plan. This is the one that started mine."
      />

      <div className="grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        {/* narrative */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="space-y-6 text-lg font-light leading-relaxed text-bone/85 md:text-xl"
          >
            <p>
              I test the systems other people trust with their money, their
              data, their jobs. By trade: manual and automated QA —{" "}
              <span className="font-mono text-amber">Playwright</span>,
              Cypress, Selenium, Postman. By obsession: everything after the
              feature is &quot;done&quot; — the edge case nobody tried, the API
              contract nobody read twice, the regression that only shows up
              under load. Right now that means leading QA for an HRIS
              platform four people rely on to ship safely every single week,
              across web, mobile and API.
            </p>
            <p>
              And I don&apos;t just file the bug —{" "}
              <span className="text-bone">I build the gate that stops it happening again</span>.
              A UAT sign-off process built from zero, requiring joint PM and
              QA approval before anything reaches production. Multi-repo
              GitHub Actions pipelines so regression and smoke suites run on
              every build, not just before a release. Automated mobile flows
              in Maestro, automated APIs in Postman, automated everything
              that shouldn&apos;t need a human twice.
            </p>
          </motion.div>

          {/* origin commit card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="artifact mt-12 p-6 font-mono text-xs leading-loose md:text-sm"
          >
            <div className="mb-3 flex items-center justify-between text-[10px] tracking-[0.25em] text-dust">
              <span>TEST CASE #0001</span>
              <span className="text-go">✓ PASSED</span>
            </div>
            <div className="text-dust">
              <span className="text-amber">case QA-0001</span> (status:{" "}
              <span className="text-amber">OPEN</span>, priority:{" "}
              <span className="text-invert">P0</span>)
            </div>
            <div>Author: Nuruddin Kawsar &lt;nuruddinkawsar1995@gmail.com&gt;</div>
            <div className="mb-3">Filed: Aug 2021 — present · Dhaka</div>
            <div className="text-bone/90">
              &nbsp;&nbsp;&nbsp;&nbsp;steps to reproduce: join as an intern. never stop testing.
            </div>
            <div className="mt-3 text-dust">
              &nbsp;&nbsp;&nbsp;&nbsp;5 roles held, 1 QA team built from scratch,
              0 regressions missed at sign-off
            </div>
          </motion.div>
        </div>

        {/* telemetry board — fills the column, no dead space */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="flex flex-col self-stretch border border-faint/30"
        >
          <div className="flex items-center justify-between gap-3 border-b border-faint/30 px-5 py-3.5">
            <span className="font-mono text-[9px] tracking-[0.28em] text-dust md:text-[10px]">
              COVERAGE BOARD — LIVE FROM THE SPRINT
            </span>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-go">
              <StatusDot tone="go" pulse />
              NOMINAL
            </span>
          </div>

          <div className="grid flex-1 auto-rows-fr gap-px bg-faint/25 sm:grid-cols-2">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                className="group flex flex-col justify-center bg-void p-5 transition-colors duration-500 hover:bg-steel/60 md:p-6"
              >
                <div className="display-xl text-3xl text-bone transition-colors duration-500 group-hover:text-amber md:text-4xl xl:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 font-mono text-[9px] leading-relaxed tracking-[0.15em] text-dust md:text-[10px]">
                  {stat.label}
                </div>
                <div className="mt-1.5 inline-block border border-faint/30 bg-faint/10 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.3em] text-faint">
                  {stat.mono}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-faint/30 px-5 py-3.5 font-mono text-[8px] tracking-[0.18em] text-dust md:text-[9px]">
            <span className="text-go">▸</span>4 CASE STUDIES SHIPPED · 1 TEAM
            LED · 0 REGRESSIONS ESCAPED SIGN-OFF
          </div>
        </motion.aside>
      </div>

      {/* the beats worth pausing for */}
      <Principle
        index="01"
        lines={[
          { text: "QUALITY IS NOT A FEATURE.", className: "text-outline" },
          { text: "IT IS THE STANDARD.", className: "glow-amber text-amber" },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto mt-24 max-w-3xl text-center md:mt-32"
      >
        <p className="text-lg font-light leading-relaxed text-bone/80 md:text-xl">
          When something breaks — and in five years of testing, everything
          eventually does — I don&apos;t just log it and move on. Every bug
          gets documented in enough detail that a developer can fix it
          without a single follow-up question, and every pattern gets folded
          back into the process: a new regression check, a new line on the
          UAT gate, a rule the next release inherits for free. Because in QA,
          the closest thing to{" "}
          <span className="italic text-bone">bending time</span> is
          preventing the future:
        </p>
      </motion.div>

      <Principle
        index="02"
        lines={[
          { text: "CATCH IT IN STAGING,", className: "text-bone" },
          { text: "OR MEET IT IN PRODUCTION.", className: "text-outline-amber" },
        ]}
      />
    </section>
  );
}
