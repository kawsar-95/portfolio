import { ShieldCheck } from "lucide-react";
import MetricBadge from "@/components/devsecops/MetricBadge";
import type { Severity, SecurityFinding } from "@/lib/data";

interface SecurityReportCardProps {
  tool: string;
  scannedSurfaces: string[];
  headline: string;
  variant?: "narrative" | "counts";
  severityCounts?: Record<Severity, number>;
  findings?: SecurityFinding[];
  className?: string;
}

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

/**
 * Styled like a security-review report — deliberately honest about what
 * was actually done. Default "narrative" variant carries no fabricated
 * severity counts, because none exist in the sourced content. A
 * "counts" variant exists for when real, defensible numbers are supplied.
 */
export default function SecurityReportCard({
  tool,
  scannedSurfaces,
  headline,
  variant = "narrative",
  severityCounts,
  findings,
  className = "",
}: SecurityReportCardProps) {
  return (
    <div className={`artifact overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-bone/8 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-go/70" />
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em] text-dust">
          ~/connexpay/compliance-report.log
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-go">
          <ShieldCheck size={12} />
          REVIEWED
        </span>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-mono text-sm tracking-[0.15em] text-bone md:text-base">
            {headline}
          </h3>
          <MetricBadge label="METHOD" value="MANUAL REVIEW" tone="invert" />
        </div>

        <div className="mt-5 font-mono text-[10px] tracking-[0.2em] text-faint">
          SCANNED SURFACES
        </div>
        <ul className="mt-2 space-y-1.5">
          {scannedSurfaces.map((s) => (
            <li key={s} className="font-mono text-[11px] leading-relaxed text-dust md:text-xs">
              <span className="mr-2 text-go">▸</span>
              {s}
            </li>
          ))}
        </ul>

        {variant === "counts" && severityCounts && (
          <div className="mt-6 grid grid-cols-2 gap-px bg-faint/25 sm:grid-cols-4">
            {SEVERITY_ORDER.map((sev) => (
              <div
                key={sev}
                className={`bg-void p-4 text-center severity-${sev}`}
              >
                <div className="font-mono text-2xl">{severityCounts[sev]}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em]">
                  {sev}
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === "counts" && findings && findings.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-bone/8 pt-5">
            {findings.map((f) => (
              <li key={f.id} className={`font-mono text-[10px] leading-relaxed severity-${f.severity}`}>
                <span className="mr-2 uppercase tracking-wider">[{f.severity}]</span>
                <span className="text-bone/80">{f.area}:</span>{" "}
                <span className="text-dust">{f.summary}</span>{" "}
                <span className="text-faint">({f.status})</span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 border-t border-bone/8 pt-5 font-mono text-[10px] leading-relaxed text-faint">
          {tool}
        </p>
      </div>
    </div>
  );
}
