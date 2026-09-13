"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/data";
import { useLenis } from "./SmoothScroll";
import { useTheme } from "@/components/ThemeProvider";

/**
 * The pipeline rail — every QA release visualized on the left edge.
 * Stages light up as the visitor's scroll executes the site.
 */
export default function PipelineNav() {
  const lenis = useLenis();
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState<string>("spec");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    PIPELINE_STAGES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const activeIndex = PIPELINE_STAGES.findIndex((s) => s.id === active);
  const activeStage = PIPELINE_STAGES[activeIndex];

  return (
    <>
      {/* ---- Top bar ---- */}
      {/* mobile: gradient scrim so scrolling text never collides with the logo;
          md+: blend mode, content rarely reaches the bar there */}
      <header className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between bg-gradient-to-b from-void via-void/85 to-transparent px-5 pb-6 pt-4 md:bg-none md:px-8 md:pb-4 md:mix-blend-difference">
        <button
          onClick={() => goTo("spec")}
          data-cursor="TOP"
          className="font-mono text-xs font-bold tracking-[0.3em] text-bone"
        >
          QA<span className="text-amber">://</span>RUN
        </button>

        <button
          onClick={toggleTheme}
          data-cursor="THEME"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-7 w-7 items-center justify-center border border-bone/15 text-bone/70 transition-colors hover:border-amber/50 hover:text-amber"
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </header>

      {/* ---- Bottom progress (mobile) ---- */}
      <div className="fixed inset-x-0 bottom-0 z-[100] bg-gradient-to-t from-void via-void/85 to-transparent pt-6 lg:hidden">
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="font-mono text-[9px] tracking-[0.3em] text-amber">
            {activeStage?.label}
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-dust">
            {String(Math.round(progress * 100)).padStart(3, "0")}%
          </span>
        </div>
        <div className="h-px w-full bg-faint/40">
          <div
            className="h-px bg-amber transition-[width] duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* ---- Desktop scroll progress: hairline on right edge ---- */}
      <div className="fixed bottom-0 right-0 top-0 z-[100] hidden w-px bg-faint/30 lg:block">
        <div
          className="w-px bg-amber/80"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </>
  );
}
