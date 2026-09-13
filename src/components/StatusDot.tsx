const TONE_BG: Record<string, string> = {
  go: "bg-go",
  amber: "bg-amber",
  danger: "bg-danger",
  invert: "bg-invert",
  dust: "bg-dust",
};

export type StatusTone = "go" | "amber" | "danger" | "invert" | "dust";

/** Shared pulsing/static status dot — the "LIVE"/"NOMINAL"/"CONNECTED" marker used across sections. */
export default function StatusDot({
  tone,
  pulse = false,
  className = "",
}: {
  tone: StatusTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full ${TONE_BG[tone]} ${pulse ? "animate-pulse-soft" : ""} ${className}`}
    />
  );
}
