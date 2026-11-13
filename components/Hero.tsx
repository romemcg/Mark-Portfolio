"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { identity } from "@/content/data";

// The headline, animated subtitle and description. Rendered twice (real layer + aria-hidden white duplicate) with
// identical markup and classes so both lay out identically. Only the real layer uses h1/p semantics.
function HeroText({ i, ink = false }: { i: number; ink?: boolean }) {
  const H = ink ? motion.div : motion.h1;
  const P = ink ? motion.div : motion.p;
  const line = ink ? {} : { "data-twin-line": "" };
  return (
    <>
      <H initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }} className="display mx-auto mt-8 max-w-4xl text-[clamp(2.4rem,7vw,4.6rem)]" {...line}>
        Hi, I&apos;m Mark.
        <span className="relative mt-1 block h-[1.15em] overflow-hidden" aria-live="off">
          <AnimatePresence mode="wait">
            <motion.span key={i} initial={{ opacity: 0, y: "60%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "-60%" }} transition={{ duration: 0.4 }} className="grad absolute inset-x-0 top-0 block whitespace-nowrap pb-2 text-[0.7em] min-[430px]:text-[0.85em] sm:text-[1em]" {...line}>{identity[i]}</motion.span>
          </AnimatePresence>
        </span>
      </H>
      <P initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mx-auto mt-6 max-w-xl text-lg text-soft" {...line}>
        I work at the intersection of technology, business and problem solving, and I build things to learn faster.
      </P>
    </>
  );
}

export function Hero() {
  const [i, setI] = useState(0);
  const floatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const el = floatRef.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.translate = `${x * 16}px ${y * 12}px`;
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % identity.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="wrap relative pb-16 pt-14 text-center md:pb-24 md:pt-20">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mx-auto hero-photo">
        <div ref={floatRef} className="photo-float relative h-full w-full">
          <span aria-hidden className="photo-halo" />
          <span aria-hidden className="photo-ring" />
          <Image src="/img/mark.webp" alt="Portrait of Mark Gomez" width={600} height={600} priority className="photo-img absolute inset-[4px] h-[calc(100%-8px)] w-[calc(100%-8px)] rounded-full object-cover object-[50%_15%]" />
        </div>
      </motion.div>
      <div className="relative flow-root">
        <HeroText i={i} />
        {/* decorative white duplicate, revealed only inside the cursor/touch mask (lib/twin/ink.ts) */}
        <div aria-hidden data-twin-ink className="twin-ink absolute inset-0 flow-root"><HeroText i={i} ink /></div>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/projects/" className="btn btn-accent whitespace-nowrap !px-7 !py-3.5">Explore my work <span aria-hidden>→</span></Link>
        <Link href="/about/#beyond-work" className="btn btn-ghost whitespace-nowrap !px-7 !py-3.5">Get to know me</Link>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mx-auto mt-8 max-w-xl">
        <Link href="/career/" className="group flex items-center justify-between gap-4 rounded-2xl border-[1.5px] border-accent/40 bg-accent/10 px-5 py-4 text-left transition hover:border-accent hover:bg-accent/15">
          <span><b className="block text-base">Hiring? Open the Recruiter view</b><span className="block text-sm text-soft">Experience, results, projects and contact on one page.</span></span>
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-onaccent transition group-hover:translate-x-0.5">→</span>
        </Link>
        <a href="/Mark-Gomez-CV.pdf" download className="mt-3 inline-block text-sm text-soft underline decoration-accent underline-offset-4 transition hover:text-accent">Prefer a PDF? Download my CV</a>
      </motion.div>
    </section>
  );
}
