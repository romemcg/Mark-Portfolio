"use client";
import { useState } from "react";
import { site } from "@/content/data";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  if (!site.formEndpoint) return null;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website")) return; // honeypot
    setState("sending");
    try {
      const r = await fetch(site.formEndpoint, { method: "POST", body: f, headers: { Accept: "application/json" } });
      setState(r.ok ? "sent" : "error");
    } catch { setState("error"); }
  }
  const input = "mt-1 w-full rounded-xl border border-line/25 bg-card px-4 py-3";
  return (
    <form onSubmit={submit} className="card grid gap-4 p-6">
      <label className="text-sm font-medium">Name<input name="name" required className={input} /></label>
      <label className="text-sm font-medium">Email<input name="email" type="email" required className={input} /></label>
      <label className="text-sm font-medium">What is it about?
        <select name="topic" className={input}><option>Career opportunity</option><option>Collaboration</option><option>Project inquiry</option><option>Networking</option><option>Something else</option></select>
      </label>
      <label className="text-sm font-medium">Message<textarea name="message" required rows={5} className={input} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button className="btn btn-solid w-fit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
      {state === "sent" && <p role="status" className="text-accent">Thanks, I will reply soon.</p>}
      {state === "error" && <p role="alert">Something went wrong. Please email me directly.</p>}
    </form>
  );
}
