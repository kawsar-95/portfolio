"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOT_SEQUENCE } from "@/lib/data";

type Phase = "boot" | "title" | "exit";

/**
 * The boot sequence. A pipeline runtime comes alive, a title card flashes,
 * and the reel begins. Click anywhere to skip.
 */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<Phase>("boot");
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setPhase("exit");
    setTimeout(onComplete, 750);
  };

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Type boot lines in sequence
    let acc = 300;
    BOOT_SEQUENCE.forEach((line, i) => {
      acc += line.delay * 4.5;
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setLines((prev) => [...prev, line.text]);
          setPct(Math.round(((i + 1) / BOOT_SEQUENCE.length) * 100));
        }, acc)
      );
    });

    // Title card, then reveal
    timers.push(setTimeout(() => !cancelled && setPhase("title"), acc + 380));
    timers.push(setTimeout(() => !cancelled && finish(), acc + 1650));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[300] flex cursor-pointer items-center justify-center bg-void"
          onClick={finish}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          {phase === "boot" && (
            <div className="w-full max-w-xl px-6">
              <div className="mb-6 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-dust">
                <span>INITIALIZING QA SUITE</span>
                <span className="text-amber">{String(pct).padStart(3, "0")}%</span>
              </div>
              <div className="min-h-[220px] font-mono text-[11px] leading-[1.9] text-bone/70 md:text-xs">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {line.startsWith("[ OK ]") ? (
                      <>
                        <span className="text-go">[ OK ]</span>
                        {line.slice(6)}
                      </>
                    ) : line.startsWith(">") ? (
                      <span className="text-amber">{line}</span>
                    ) : line.includes("READY") ? (
                      <span className="font-bold text-bone">{line}</span>
                    ) : (
                      line || "\u00A0"
                    )}
                  </motion.div>
                ))}
                <span className="inline-block h-3.5 w-2 animate-blink bg-amber align-middle" />
              </div>
              <div className="mt-6 h-px w-full bg-faint/40">
                <div
                  className="h-px bg-amber transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-4 text-center font-mono text-[9px] tracking-[0.4em] text-faint">
                CLICK TO SKIP
              </div>
            </div>
          )}

          {phase === "title" && (
            <motion.div
              className="px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.p
                className="kicker mb-5"
                initial={{ opacity: 0, letterSpacing: "0.42em" }}
                animate={{ opacity: 1, letterSpacing: "0.6em" }}
                transition={{ duration: 1 }}
              >
                A NURUDDIN KAWSAR PRODUCTION
              </motion.p>
              <motion.h1
                className="display-xl glow-amber text-6xl text-bone md:text-8xl"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                COVERAGE
              </motion.h1>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
