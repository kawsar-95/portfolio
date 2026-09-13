"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { IDENTITY } from "@/lib/data";

const Tesseract = dynamic(() => import("@/components/three/Tesseract"), {
  ssr: false,
});

/**
 * ACT I — SPEC. The tesseract hangs in the void; the name descends
 * like a title over black. Letterbox bars hold the 2.39:1 frame.
 * Reveals are CSS-driven off the `booted` class — zero hydration risk.
 */
export default function Hero({ booted }: { booted: boolean }) {
  const [letterboxed, setLetterboxed] = useState(true);

  useEffect(() => {
    const onScroll = () => setLetterboxed(window.scrollY < window.innerHeight * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("letterboxed", letterboxed && booted);
    return () => document.documentElement.classList.remove("letterboxed");
  }, [letterboxed, booted]);

  return (
    <section
      id="spec"
      className={`relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden ${booted ? "booted" : ""}`}
    >
      {/* the fourth dimension, rendered */}
      <div className="absolute inset-0 opacity-90">
        <Tesseract />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,6,7,0.72)_100%)]" />

      {/* frame content */}
      <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-24 pt-24 md:px-12 lg:px-24">
        <div className="pointer-events-none select-none">
          <h1 className="display-xl text-[clamp(4rem,14.5vw,13.5rem)]">
            <span className="line-mask">
              <span className="line-inner text-bone" style={{ transitionDelay: "0.4s" }}>
                NURUDDIN
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner text-amber" style={{ transitionDelay: "0.52s" }}>
                KAWSAR
              </span>
            </span>
          </h1>

          <div
            className="boot-fade mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 md:mt-9"
            style={{ transitionDelay: "0.9s" }}
          >
            <span className="font-mono text-xs font-bold tracking-[0.4em] text-bone md:text-sm">
              {IDENTITY.role}
            </span>
            <span className="hidden h-3 w-px bg-amber md:block" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-dust md:text-xs">
              I BREAK THINGS BEFORE USERS DO
            </span>
          </div>
        </div>

        <div className="boot-fade flex items-end justify-between" style={{ transitionDelay: "1.15s" }}>
          <div className="font-mono text-[9px] leading-relaxed tracking-[0.2em] text-dust md:text-[10px]">
            <div>spec: QA-0001 — status: PASSED</div>
            <div className="text-faint">Author: kawsar · {IDENTITY.email}</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="kicker animate-pulse-soft">SCROLL TO EXECUTE</span>
            <motion.span
              className="block h-10 w-px bg-gradient-to-b from-amber to-transparent"
              animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
