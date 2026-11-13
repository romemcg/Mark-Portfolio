import type { Prd } from "@/content/prd";
import { Reveal } from "./Reveal";

const pri: Record<string, string> = { P0: "bg-accent/15 text-accent", P1: "bg-ink/10 text-ink/90", P2: "bg-ink/5 text-soft" };
const stateTone = (s: string) => /^(done|built|live|now)$/i.test(s) ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : /^next$/i.test(s) ? "bg-accent/15 text-accent" : "bg-ink/10 text-soft";

function H({ id, title, sub }: { id: string; title: string; sub?: string }) {
  return <div id={id} className="scroll-mt-24"><h3 className="display text-xl sm:text-2xl">{title}</h3>{sub && <p className="mt-1 text-sm text-soft">{sub}</p>}</div>;
}
function Sec({ children }: { children: React.ReactNode }) {
  return <Reveal><section className="border-t border-line/10 py-7">{children}</section></Reveal>;
}
const List = ({ items }: { items: string[] }) => <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink/85">{items.map((x) => <li key={x}>{x}</li>)}</ul>;

export function PrdSections({ prd }: { prd: Prd }) {
  const nav = [
    ["overview", "Overview"], ["goals", "Goals"], prd.personas && ["users", "Users"], prd.stories && ["stories", "User stories"],
    prd.requirements && ["requirements", "Requirements"], prd.nfr && ["nfr", "Non functional"], prd.scope && ["scope", "Scope"],
    prd.metrics && ["metrics", "Success metrics"], prd.phases && ["release", "Release plan"], prd.risks && ["risks", "Risks"], prd.open && ["open", "Open questions"],
  ].filter(Boolean) as string[][];
  return (
    <div className="mt-10">
      <p className="eyebrow">Product requirements</p>
      <h2 className="display mt-1 text-3xl sm:text-4xl">PRD</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-line/10 p-4 text-sm sm:grid-cols-4">
        {[["Version", prd.meta.version], ["Status", prd.meta.status], ["Owner", prd.meta.owner], ["Updated", prd.meta.updated]].map(([k, v]) => (
          <div key={k}><dt className="text-xs uppercase tracking-wide text-soft">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
        ))}
      </dl>
      <nav aria-label="PRD sections" className="mt-4 flex flex-wrap gap-2">
        {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="chip hover:text-accent">{label}</a>)}
      </nav>
      {prd.note && <p className="mt-4 rounded-xl bg-ink/5 p-3 text-sm text-soft">{prd.note}</p>}

      <Sec><H id="overview" title="1. Overview" /><p className="mt-3 text-ink/85">{prd.overview}</p></Sec>
      <Sec><H id="goals" title="2. Goals and non goals" />
        <div className="mt-3 grid gap-6 md:grid-cols-2">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-soft">Goals</p><List items={prd.goals} /></div>
          {prd.nonGoals && <div><p className="text-sm font-semibold uppercase tracking-wide text-soft">Non goals</p><List items={prd.nonGoals} /></div>}
        </div>
      </Sec>
      {prd.personas && <Sec><H id="users" title="3. Users and needs" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{prd.personas.map((p) => <div key={p.name} className="card p-4"><p className="font-semibold">{p.name}</p><p className="mt-1 text-sm text-ink/90">{p.need}</p></div>)}</div>
      </Sec>}
      {prd.stories && <Sec><H id="stories" title="4. User stories" /><List items={prd.stories} /></Sec>}
      {prd.requirements && <Sec><H id="requirements" title="5. Functional requirements" sub="P0 is required for the first release. P1 follows. P2 needs evidence first." />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {prd.requirements.map((r) => (
            <article key={r.id} className="card p-4">
              <div className="flex items-center gap-2"><span className="text-xs font-semibold text-soft">{r.id}</span><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pri[r.priority]}`}>{r.priority}</span></div>
              <h4 className="mt-2 font-semibold">{r.title}</h4>
              <p className="mt-1 text-sm text-ink/90">{r.detail}</p>
              <p className="mt-3 text-sm"><span className="font-semibold">Acceptance: </span><span className="text-ink/90">{r.acceptance}</span></p>
            </article>
          ))}
        </div>
      </Sec>}
      {prd.nfr && <Sec><H id="nfr" title="6. Non functional requirements" />
        <dl className="mt-4 divide-y divide-line/10 rounded-2xl border border-line/10">{prd.nfr.map((n) => (
          <div key={n.area} className="grid gap-1 p-3 sm:grid-cols-[10rem_1fr] sm:gap-4"><dt className="text-sm font-semibold">{n.area}</dt><dd className="text-sm text-ink/90">{n.requirement}</dd></div>
        ))}</dl>
      </Sec>}
      {prd.scope && <Sec><H id="scope" title="7. Scope" />
        <div className="mt-3 grid gap-6 md:grid-cols-2">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-soft">In scope</p><List items={prd.scope.in} /></div>
          <div><p className="text-sm font-semibold uppercase tracking-wide text-soft">Out of scope</p><List items={prd.scope.out} /></div>
        </div>
      </Sec>}
      {prd.metrics && <Sec><H id="metrics" title="8. Success metrics" sub="Targets are separate from results. Anything not yet measured says so." />
        <div className="mt-4 grid gap-3 md:grid-cols-2">{prd.metrics.map((m) => (
          <div key={m.metric} className="card p-4"><p className="font-semibold">{m.metric}</p><p className="mt-1 text-sm text-ink/90"><span className="font-medium">Target: </span>{m.target}</p><p className="mt-2 inline-block rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium">{m.status}</p></div>
        ))}</div>
      </Sec>}
      {prd.phases && <Sec><H id="release" title="9. Release plan" />
        <ol className="mt-4 space-y-3">{prd.phases.map((p) => (
          <li key={p.name} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold">{p.name}</p><p className="mt-1 text-sm text-ink/90">{p.detail}</p></div><span className={`self-start whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${stateTone(p.state)}`}>{p.state}</span></li>
        ))}</ol>
      </Sec>}
      {prd.risks && <Sec><H id="risks" title="10. Risks and mitigations" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">{prd.risks.map((r) => <div key={r.risk} className="card p-4"><p className="font-semibold">{r.risk}</p><p className="mt-2 text-sm text-ink/90"><span className="font-medium">Mitigation: </span>{r.mitigation}</p></div>)}</div>
      </Sec>}
      {prd.open && <Sec><H id="open" title="11. Open questions" /><List items={prd.open} /></Sec>}
      {prd.limits && <Sec><H id="limits" title="12. Known limitations" /><List items={prd.limits} /></Sec>}
    </div>
  );
}
