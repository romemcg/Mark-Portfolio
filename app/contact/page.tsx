import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { BusinessCard } from "@/components/BusinessCard";
import { site } from "@/content/data";

export const metadata: Metadata = { title: "Contact", description: "Get in touch about roles, collaboration or projects.", alternates: { canonical: "/contact/" } };

export default function Contact() {
  return (
    <section className="wrap pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-3 max-w-3xl text-[clamp(2.4rem,7vw,4.5rem)]">Let&apos;s connect.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/90">Product roles, collaboration or a project idea. The fastest way to reach me is email.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="/mark-gomez.vcf" download="Mark-Gomez.vcf" className="btn btn-accent justify-center whitespace-nowrap !px-7 !py-3.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M15 10h3M15 13h3" /></svg>
              Save my contact
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-ghost justify-center whitespace-nowrap !px-7 !py-3.5">Email me</a>
          </div>
          <p className="mt-6 text-sm text-soft">Based in the {site.base}.</p>
        </Reveal>
        <Reveal>
          <div className="bc-tilt flex justify-center lg:justify-end"><BusinessCard /></div>
        </Reveal>
      </div>
      {site.formEndpoint && <div className="mt-12 max-w-xl"><ContactForm /></div>}
    </section>
  );
}
