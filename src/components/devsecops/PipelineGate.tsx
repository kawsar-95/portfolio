import { CircleCheck, CircleX, CircleDashed, TriangleAlert } from "lucide-react";
import StatusDot from "@/components/StatusDot";
import type { GateStep } from "@/lib/data";

const STATUS_ICON: Record<GateStep["status"], React.ReactNode> = {
  pass: <CircleCheck size={15} className="text-go" />,
  fail: <CircleX size={15} className="text-danger" />,
  running: <StatusDot tone="amber" pulse className="h-3.5 w-3.5" />,
  pending: <CircleDashed size={15} className="text-faint" />,
  warn: <TriangleAlert size={15} className="text-amber" />,
};

const STATUS_TEXT: Record<GateStep["status"], string> = {
  pass: "text-go",
  fail: "text-danger",
  running: "text-amber",
  pending: "text-faint",
  warn: "text-amber",
};

/**
 * A CI-style sequential check run — every step a real release actually
 * passes through. Always renders as a horizontal row (like a GitHub
 * Actions / Jenkins check list), scrolling on narrow screens rather
 * than restacking, so it reads as one continuous run at every width.
 */
export default function PipelineGate({
  title,
  steps,
  className = "",
}: {
  title: string;
  steps: GateStep[];
  className?: string;
}) {
  return (
    <div className={`artifact overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-bone/8 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-go/70" />
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em] text-dust">{title}</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
          {steps.length} CHECKS
        </span>
      </div>

      <div className="overflow-x-auto p-5 md:p-8">
        <div className="flex min-w-max items-start gap-0">
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            const nextDone = !last && steps[i + 1].status === "pass";
            return (
              <div key={step.id} className="flex items-start">
                <div className="flex w-[88px] flex-col items-center gap-2 text-center">
                  {STATUS_ICON[step.status]}
                  <div>
                    <div className={`font-mono text-[9px] tracking-[0.15em] ${STATUS_TEXT[step.status]}`}>
                      {step.label}
                    </div>
                    {step.detail && (
                      <div className="mt-0.5 font-mono text-[8px] leading-tight tracking-wide text-faint">
                        {step.detail}
                      </div>
                    )}
                  </div>
                </div>
                {!last && (
                  <div
                    className={`gate-connector mt-[7px] w-4 shrink-0 md:w-6 ${nextDone ? "done" : ""}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
