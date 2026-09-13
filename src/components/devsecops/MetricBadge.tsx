import ToolIcon, { type ToolSlug } from "@/components/ToolIcon";

const TONE_TEXT: Record<string, string> = {
  go: "text-go",
  amber: "text-amber",
  danger: "text-danger",
  invert: "text-invert",
  dust: "text-dust",
};

/** Shields.io-style label/value pill — e.g. BUILD · PASSING, COVERAGE · 94%. */
export default function MetricBadge({
  label,
  value,
  tone = "go",
  icon,
  className = "",
}: {
  label: string;
  value: string;
  tone?: "go" | "amber" | "danger" | "invert" | "dust";
  icon?: ToolSlug;
  className?: string;
}) {
  return (
    <span className={`badge ${className}`}>
      <span className="badge-label flex items-center gap-1.5">
        {icon && <ToolIcon tool={icon} size={11} />}
        {label}
      </span>
      <span className={`badge-value ${TONE_TEXT[tone]}`}>{value}</span>
    </span>
  );
}
