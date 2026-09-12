"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { CASE_STUDIES, type Artifact } from "@/lib/data";

function StatusBadge({ status }: { status: Artifact["status"] }) {
  if (status === "LIVE")
    return (
      <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-go">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-go" />
        LIVE
      </span>
    );
  if (status === "REDEPLOYING")
    return (
      <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-amber">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-amber" />
        REDEPLOYING
      </span>
    );
  if (status === "DEPLOYED")
    return (
      <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-amber">
        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
        DEPLOYED
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-dust">
      <span className="h-1.5 w-1.5 rounded-full bg-dust" />
      ARCHIVED
    </span>
  );
}

function track(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function ArtifactLinks({ a }: { a: Artifact }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
      {a.url && (
        <a
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="OPEN"
          className="group/link flex items-center gap-1.5 text-amber transition-colors hover:text-signal"
        >
          {a.url.replace("https://", "")}
          <span className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
            ↗
          </span>
        </a>
      )}
      {a.links?.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="OPEN"
          className="group/link flex items-center gap-1.5 text-invert transition-colors hover:text-bone"
        >
          {l.label}
          <span className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
            ↗
          </span>
        </a>
      ))}
      {a.repo && (
        <a
          href={a.repo}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="GIT"
          className="group/link flex items-center gap-1.5 text-dust transition-colors hover:text-bone"
        >
          source
          <span className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
            ↗
          </span>
        </a>
      )}
    </div>
  );
}

/** Case-study card — featured platforms still live in production */
function BigCard({ a, i, featured = false }: { a: Artifact; i: number; featured?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (i % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={track}
      className={`artifact flex flex-col p-6 md:p-8 ${featured ? "artifact-live border-go/20" : ""}`}
    >
      <div className="mb-5 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-faint">
        <span className="truncate">
          case-file // {a.id.toLowerCase()}<span className="text-amber">:{a.version}</span>
        </span>
        <StatusBadge status={a.status} />
      </div>

      <h3 className="display-xl text-3xl text-bone md:text-4xl">{a.name}</h3>
      <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-amber">
        {a.kind}
      </div>

      {featured && (
        <div className="mt-4 flex items-center gap-2 border-y border-go/15 bg-go/5 px-3 py-2 font-mono text-[9px] tracking-[0.25em] text-go">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-go" />
          STILL LIVE IN PRODUCTION
        </div>
      )}

      <p className="mt-4 flex-1 text-sm font-light leading-relaxed text-bone/70">
        {a.description}
      </p>

      <ul className="mt-5 space-y-1.5">
        {a.proof.map((p) => (
          <li key={p.slice(0, 32)} className="font-mono text-[10px] leading-relaxed text-dust md:text-[11px]">
            <span className="mr-2 text-go">✓</span>
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {a.stack.map((s) => (
          <span
            key={s}
            className="bg-bone/5 px-2 py-0.5 font-mono text-[9px] tracking-wider text-dust"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-6 border-t border-bone/8 pt-4">
        {a.url || a.repo || a.links?.length ? (
          <ArtifactLinks a={a} />
        ) : (
          <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
            client engagement — no public link
          </span>
        )}
      </div>
    </motion.article>
  );
}

/**
 * ACT V — REPORT. Case studies from four platforms tested end to end.
 */
export default function Projects() {
  const live = CASE_STUDIES.filter((a) => a.status === "LIVE");
  const other = CASE_STUDIES.filter((a) => a.status !== "LIVE");

  return (
    <section id="report" className="relative px-5 py-32 md:px-12 md:py-44 lg:px-24">
      <SectionTitle
        act="ACT V"
        title="REPORT"
        log="Four platforms, four different ways to fail. Here's what I caught before anyone else did."
      />

      <div className="mb-6 flex items-center gap-4">
        <h3 className="font-mono text-xs font-bold tracking-[0.35em] text-bone">
          CASE STUDIES
        </h3>
        <span className="h-px flex-1 bg-faint/40" />
        <span className="font-mono text-[9px] tracking-[0.25em] text-dust">
          {CASE_STUDIES.length} PLATFORMS TESTED END TO END
        </span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {live.map((a, i) => (
          <BigCard key={a.id} a={a} i={i} featured />
        ))}
        {other.map((a, i) => (
          <BigCard key={a.id} a={a} i={i} />
        ))}
      </div>
    </section>
  );
}
