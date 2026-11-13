import type { Status } from "@/content/data";

const color: Record<Status | "Employer work", string> = {
  Concept: "#64748B",
  Research: "#0891B2",
  Prototype: "#8B5CF6",
  "In Development": "#F59E0B",
  Launched: "#16A34A",
  Archived: "#64748B",
  "Employer work": "#0EA5E9",
};

export function StatusBadge({ status }: { status?: Status }) {
  const label = status ?? "Employer work";
  const c = color[label];
  return (
    <span className="chip" style={{ color: `color-mix(in srgb, ${c} 40%, rgb(var(--ink)))`, background: `color-mix(in srgb, ${c} 16%, transparent)`, borderColor: `color-mix(in srgb, ${c} 45%, transparent)` }}>
      <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {label}
    </span>
  );
}
