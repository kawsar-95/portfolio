"use client";

import { motion } from "framer-motion";

/**
 * Interlude — a single frame of pure cinema between acts.
 */
export default function Interlude() {
  return (
    <div className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-5 py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,163,61,0.05),transparent_60%)]" />
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="kicker mb-8"
        >
          INTERMISSION
        </motion.div>
        <motion.div
          className="overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          <motion.p
            variants={{ hidden: { y: "105%" }, visible: { y: 0 } }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl text-[clamp(2.2rem,7vw,6rem)] text-bone"
          >
            TIME IS <span className="text-outline">RELATIVE.</span>
          </motion.p>
        </motion.div>
        <motion.div
          className="overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          <motion.p
            variants={{ hidden: { y: "105%" }, visible: { y: 0 } }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl text-[clamp(2.2rem,7vw,6rem)] text-amber"
          >
            COVERAGE IS ABSOLUTE.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
