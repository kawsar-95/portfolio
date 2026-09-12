"use client";

import { useEffect, useState } from "react";

/**
 * Mission Elapsed Time — the Interstellar clock.
 * Starts at T+00:00:00 the moment the pipeline boots.
 */
export default function MissionClock({ bootedAt }: { bootedAt: number | null }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!bootedAt) return;
    const tick = () => setElapsed(Math.floor((Date.now() - bootedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [bootedAt]);

  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed / 60) % 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-dust">
      <span className="inline-block h-1 w-1 animate-pulse-soft rounded-full bg-amber" />
      <span>
        T+{h}:{m}:{s}
      </span>
    </div>
  );
}
