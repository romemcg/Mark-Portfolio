"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { education, recruiter, roles, site } from "@/content/data";
import Image from "next/image";
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
        <div className="mt-8 space-y-5">
          <section className="rv-board" aria-label="Professional impact snapshot">
            <header className="rv-head">
              <div className="rv-photo"><Image src="/img/mark-card.webp" alt={`Portrait of ${recruiter.name}`} width={160} height={160} className="h-full w-full rounded-full object-cover" /></div>
              <div className="rv-title">
                <h3 className="display text-3xl text-accent md:text-5xl">{recruiter.name}</h3>
                <p className="mt-2 text-base md:text-2xl">{recruiter.headline}</p>
                <p className="mt-2 text-xs font-semibold tracking-wide text-soft md:text-sm">{recruiter.domains}</p>
              </div>
            </header>
            <div className="rv-cols">
              <div className="rv-impact-m">
                <h4 className="rv-sec">Selected business impact</h4>
                <div className="grid grid-cols-2 gap-3">
                  {recruiter.impact.map((o) => (
                    <div key={o.label} className="rv-stat card rounded-2xl p-3">
                      <p className="rv-num">{o.value}</p>
                      <p className="mt-2 text-xs leading-snug">{o.label}</p>
                      <p className="mt-1.5 text-[.65rem] font-semibold uppercase tracking-[.12em] text-soft">{o.where}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-soft">{recruiter.impactNote}</p>
              </div>
              <div className="rv-left">
                <h4 className="rv-sec">Profile summary</h4>
                <ul className="rv-list">{recruiter.profile.map((p) => <li key={p.who}><b>{p.who}:</b> {p.what}</li>)}</ul>
                <h4 className="rv-sec">Education and certifications</h4>
                <ul className="rv-list">{recruiter.keyCreds.map((t) => <li key={t}>{t}</li>)}</ul>
                <h4 className="rv-sec">Former employers and experience</h4>
                <ul className="rv-list">{recruiter.employers.map((t) => <li key={t}>{t}</li>)}</ul>
                <p className="rv-note">{recruiter.independent}</p>
                <h4 className="rv-sec">Experience working in UAE and KSA</h4>
                <ul className="rv-list">{recruiter.gulf.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div className="rv-right">
                <h4 className="rv-sec">Selected projects</h4>
                <div>{recruiter.projects.map((p) => (
                  <article key={p.name} className="rv-bar">
                    <h5>{p.name} <span className="rv-meta">{p.org} · {p.status}</span></h5>
                    <p>{p.what}</p>
                  </article>
                ))}</div>
              </div>
            </div>
          </section>

          <section aria-labelledby="rv-impact" className="rv-impact-d">
            <h2 id="rv-impact" className="sr-only">Selected business impact</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {recruiter.impact.map((o) => (
                <div key={o.label} className="rv-stat card rounded-2xl p-4">
                  <p className="rv-num">{o.value}</p>
                  <p className="mt-2 text-sm leading-snug">{o.label}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[.14em] text-soft">{o.where}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-soft">{recruiter.impactNote}</p>
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

          <details className="card p-5 md:p-6 rv-more">
            <summary className="cursor-pointer text-sm font-semibold">Core strengths and all verified certifications</summary>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                {recruiter.strengths.map((g) => (
                  <div key={g.group} className="rv-group"><h3>{g.group}</h3><p className="mt-1.5 text-sm leading-relaxed text-soft">{g.items.join(" · ")}</p></div>
                ))}
              </div>
              <div className="space-y-3">
                {recruiter.credentials.map((g) => (
                  <div key={g.group} className="rv-group"><h3>{g.group}</h3>
                    <ul className="mt-1.5 space-y-1 text-sm leading-snug">{g.items.map((c) => <li key={c} className="flex gap-2.5"><span aria-hidden className="rv-tick">✓</span><span>{c}</span></li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </details>
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
