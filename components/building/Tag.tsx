const styles = {
  industry: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  author: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  simulated: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  proposed: "border-teal-400/40 bg-teal-400/10 text-teal-300",
} as const;
const labels = { industry: "Industry practice", author: "Author analysis", simulated: "Simulated", proposed: "Proposed" } as const;
export type TagKind = keyof typeof styles;
export function Tag({ kind }: { kind: TagKind }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles[kind]}`}>{labels[kind]}</span>;
}
