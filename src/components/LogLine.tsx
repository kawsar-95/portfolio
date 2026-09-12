"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * LogLine — the act epigraph. When it scrolls into view it types itself
 * out like a console entry behind an amber rail, then leaves a blinking
 * block cursor. Honors prefers-reduced-motion by printing instantly.
 */
export default function LogLine({
  text,
  className = "",
  speed = 22,
  startDelay = 400,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  /* reduced motion: print the whole line at once */
  useEffect(() => {
    if (!inView) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setCount(text.length));
    return () => cancelAnimationFrame(raf);
  }, [inView, text]);

  /* self-perpetuating typewriter: each tick schedules the next */
  useEffect(() => {
    if (!inView || done) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(
      () => setCount((c) => c + 1),
      count === 0 ? startDelay : speed
    );
    return () => clearTimeout(timeout);
  }, [inView, count, done, text, speed, startDelay]);

  return (
    <div ref={ref} className={`flex gap-3 ${className}`}>
      <span aria-hidden className="w-[2px] shrink-0 bg-amber/40" />
      <p className="font-mono text-xs leading-relaxed tracking-wider text-dust md:text-sm">
        <span className="text-amber">{"> "}</span>
        {text.slice(0, count)}
        <span
          aria-hidden
          className={`ml-0.5 inline-block h-[0.95em] w-[0.5em] translate-y-[0.12em] ${
            !inView ? "opacity-0" : done ? "animate-blink bg-amber/80" : "bg-amber/80"
          }`}
        />
      </p>
    </div>
  );
}
