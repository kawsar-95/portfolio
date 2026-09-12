"use client";

import { motion } from "framer-motion";
import LogLine from "@/components/LogLine";

/**
 * Act title card — the Nolan chapter cut.
 * A mono kicker, an immense display word, and a one-line log entry.
 */
export default function SectionTitle({
  act,
  title,
  log,
  align = "left",
}: {
  act: string;
  title: string;
  log: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-16 md:mb-24 ${align === "center" ? "text-center" : ""}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className={`mb-4 flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="kicker text-amber">{act}</span>
        <span className="h-px w-16 bg-faint" />
        <span className="kicker">STAGE — {title}</span>
      </motion.div>

      <motion.div
        className="overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.h2
          variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl text-[clamp(3.5rem,10vw,9rem)] text-bone"
        >
          {title}
        </motion.h2>
      </motion.div>

      <LogLine
        text={log}
        className={`mt-6 max-w-xl ${align === "center" ? "mx-auto justify-center" : ""}`}
      />
    </div>
  );
}
