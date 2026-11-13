"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { education, recruiter, roles, site } from "@/content/data";
import { Logo } from "./Logo";

export function CareerView() {
  const [view, setView] = useState<"recruiter" | "full">("recruiter");
  const [openRole, setOpenRole] = useState<string | null>(null);
  return (
    <div>
      <div className="no-print flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Career view" className="inline-flex rounded-full border border-line/20 bg-bg p-1">
          {([["recruiter", "Recruiter view"], ["full", "Full journey"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${view === k ? "bg-ink text-bg" : "hover:text-accent"}`}>{l}</button>
          ))}
        </div>
      </div>

      {view === "recruiter" && (
        <div className="mt-8 space-y-6">
          <section className="rv-hero relative overflow-hidden rounded-[26px] p-6 md:p-8">
            <span aria-hidden className="rv-glow" />
            <p className="eyebrow">Professional snapshot</p>
            <h3 className="display mt-3 text-3xl md:text-4xl">{recruiter.name}</h3>
            <p className="display mt-2 text-xl text-accent md:text-2xl">{recruiter.headline}</p>
            <p className="mt-3 text-sm font-semibold tracking-wide text-soft">{recruiter.domains}</p>
            <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.7] text-ink/90">{recruiter.statement}</p>
          </section>

          <section className="card p-5 md:p-6" aria-labelledby="rv-docs">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <h2 id="rv-docs" className="rv-h">Professional documents</h2>
              <div className="flex flex-wrap gap-2">
                <a className="btn btn-accent !px-4 !py-2 !text-sm" href={`mailto:${site.email}`}>Email me <span aria-hidden>→</span></a>
                <a className="btn btn-ghost !px-4 !py-2 !text-sm" href={site.linkedin}>LinkedIn</a>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[recruiter.docs.cv, recruiter.docs.onePager].map((d) => (
                <a key={d.href} href={d.href} download className="rv-doc">
                  <span><b className="block text-[.95rem]">{d.title}</b><span className="mt-1 block text-sm leading-snug text-soft">{d.note}</span></span>
                  <span aria-hidden className="text-xl text-accent">↓</span>
                </a>
              ))}
            </div>
          </section>

          <section className="card rv-impact p-6 md:p-8" aria-labelledby="rv-impact">
            <h2 id="rv-impact" className="display text-2xl md:text-3xl">Selected business impact</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
              {recruiter.impact.map((o) => (
                <div key={o.label} className="rv-stat rounded-2xl border border-line/10 p-4 md:p-5">
                  <p className="rv-num">{o.value}</p>
                  <p className="mt-3 text-sm leading-snug">{o.label}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[.14em] text-soft">{o.where}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-soft">{recruiter.impactNote}</p>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="display text-2xl md:text-3xl">Experience</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {roles.map((r) => (
                <article key={r.id} className="rounded-2xl border border-line/10 bg-tint p-5">
                  <div className="flex items-start gap-4">
                    <Logo id={r.id} name={r.company} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="rv-date">{r.dates}</p>
                      <h3 className="display mt-1 text-[1.05rem] leading-snug">{r.company}</h3>
                      <p className="mt-0.5 text-sm text-soft">{r.title}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm leading-snug text-ink/90">
                    {(recruiter.experience[r.id] || []).map((t) => <li key={t} className="flex gap-2.5"><span aria-hidden className="mt-[.45em] h-1.5 w-1.5 flex-none rounded-full bg-accent" /><span>{t}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="display text-2xl md:text-3xl">Core strengths</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recruiter.strengths.map((g) => (
                <div key={g.group} className="rv-group">
                  <h3>{g.group}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{g.items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 md:p-8">
            <h2 className="display text-2xl md:text-3xl">Certifications and education</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {recruiter.credentials.map((g) => (
                <div key={g.group} className="rv-group">
                  <h3>{g.group}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm leading-snug">{g.items.map((c) => <li key={c} className="flex gap-2.5"><span aria-hidden className="rv-tick">✓</span><span>{c}</span></li>)}</ul>
                </div>
              ))}
              <div className="rv-group md:col-span-2">
                <h3>Education</h3>
                <ul className="mt-3 grid gap-4 text-sm md:grid-cols-2">{education.map((e) => <li key={e.school} className="flex items-center gap-3"><Logo id={e.school.startsWith("Univ") ? "ub" : "pcu"} name={e.school} size={44} square /><span className="leading-snug"><b>{e.what}</b><br /><span className="text-soft">{e.school}, {e.dates}</span></span></li>)}</ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {view === "full" && (
        <div className="mt-8 space-y-4">
          {roles.map((r) => {
            const on = openRole === r.id;
            return (
              <div key={r.id} className="card overflow-hidden">
                <button onClick={() => setOpenRole(on ? null : r.id)} aria-expanded={on} className="flex w-full items-start justify-between gap-4 p-6 text-left">
                  <div className="flex items-start gap-4"><Logo id={r.id} name={r.company} size={48} /><div><p className="text-sm text-soft">{r.dates} · {r.place}</p><h3 className="display mt-1 text-2xl">{r.company}</h3><p className="mt-1">{r.title}</p>{r.earlier && <p className="text-sm text-soft">Earlier: {r.earlier}</p>}</div></div>
                  <span aria-hidden className={`text-2xl transition ${on ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="grid gap-6 border-t border-line/10 p-6 md:grid-cols-[1.6fr_1fr]">
                        <div><p className="text-ink/90">{r.summary}</p><ul className="prose-s mt-4">{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
                        <div><p className="text-sm font-semibold">Tools and methods</p><div className="mt-2 flex flex-wrap gap-1.5">{r.tools.map((t) => <span key={t} className="chip">{t}</span>)}</div><p className="mt-5 text-sm font-semibold">Transferable skills</p><ul className="mt-2 space-y-1 text-sm">{r.transferable.map((t) => <li key={t}>✦ {t}</li>)}</ul></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
