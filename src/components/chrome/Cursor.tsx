"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor — a precision reticle. A small amber dot locked to the
 * pointer, trailed by a mono crosshair ring that eases behind it.
 * Expands over anything interactive.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const enableRaf = requestAnimationFrame(() => setEnabled(true));

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (t) {
        setHovering(true);
        setLabel(t.dataset.cursor || "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(enableRaf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-full rounded-full bg-signal"
        style={{ marginLeft: "-3px", marginTop: "-3px" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center"
        style={{ marginLeft: "-20px", marginTop: "-20px" }}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            hovering
              ? "scale-[1.7] border-amber bg-amber/10"
              : "scale-100 border-bone/30"
          }`}
        >
          {label && (
            <span className="font-mono text-[6px] tracking-[0.2em] text-amber">
              {label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
