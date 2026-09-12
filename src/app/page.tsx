"use client";

import { useState } from "react";
import SmoothScroll from "@/components/chrome/SmoothScroll";
import Cursor from "@/components/chrome/Cursor";
import PipelineNav from "@/components/chrome/PipelineNav";
import Preloader from "@/components/Preloader";
import Marquee from "@/components/Marquee";
import Interlude from "@/components/Interlude";
import Hero from "@/components/acts/Hero";
import About from "@/components/acts/About";
import Skills from "@/components/acts/Skills";
import Experience from "@/components/acts/Experience";
import Projects from "@/components/acts/Projects";
import TerminalSection from "@/components/acts/TerminalSection";
import Contact from "@/components/acts/Contact";

export default function Pipeline() {
  const [bootedAt, setBootedAt] = useState<number | null>(null);
  const booted = bootedAt !== null;

  return (
    <SmoothScroll>
      {/* cinematic overlays */}
      <div className="film-grain" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="letterbox-bar top" aria-hidden />
      <div className="letterbox-bar bottom" aria-hidden />

      <Cursor />

      {!booted && <Preloader onComplete={() => setBootedAt(Date.now())} />}

      <PipelineNav bootedAt={bootedAt} />

      <main>
        <Hero booted={booted} />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Interlude />
        <TerminalSection bootedAt={bootedAt} />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
