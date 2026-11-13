import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";

export const metadata: Metadata = { title: "About", description: "The story behind the resume: Batangas to the UAE, engineering to product.", alternates: { canonical: "/about/" } };

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="The story behind the resume." intro="I started close to the hardware and moved up the stack. The industries changed. The discipline did not. Tap any chapter to open it." />
      <section className="wrap py-6"><Reveal><div className="grid items-center gap-8 rounded-[2rem] bg-tint p-6 md:grid-cols-[1fr_1.3fr] md:p-12">
        <Image src="/img/mark.webp" alt="Mark Gomez in an office" width={900} height={900} className="mx-auto w-full max-w-sm rounded-[1.5rem] object-cover shadow-xl" />
        <div><h2 className="display text-3xl md:text-4xl">Engineer by training. Builder by curiosity.</h2><p className="mt-4 leading-relaxed text-ink/90">I am a Filipino electronics engineer from Batangas, now based in the UAE. I moved from hardware into IoT and smart city platforms, and I now build my own products on the side. The industries changed. The way I work did not: understand the problem, then make it better.</p></div>
      </div></Reveal></section>
      <section className="wrap py-10"><Timeline /></section>
      <section id="beyond-work" className="wrap scroll-mt-24 py-12">
        <Reveal>
          <p className="eyebrow">Beyond work</p>
          <h2 className="display mt-2 text-4xl md:text-5xl">Get to know me.</h2>
          <p className="mt-3 max-w-2xl text-xl text-soft">A small-town kid from Batangas, still figuring out how far life can take him.</p>
          <div className="mt-10 grid items-start gap-10 md:grid-cols-[1.35fr_1fr]">
            <div className="relative">
              <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2.2rem] bg-gradient-to-br from-blue/25 via-accent/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-card p-7 shadow-[0_24px_60px_-20px_rgb(var(--blue)/0.35)] md:p-10">
                <div aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue to-accent" />
                <span aria-hidden className="display pointer-events-none absolute -top-4 right-6 select-none text-[8rem] leading-none text-blue/10">&ldquo;</span>
                <div className="relative space-y-5 text-[1.05rem] leading-[1.8] text-ink/85">
                  <p><span className="display float-left mr-3 mt-1 text-6xl leading-[0.8] text-blue">I</span> grew up in Batangas, Philippines, with big dreams and no clear idea where life would lead me. Along the way, I became an <strong className="font-semibold text-ink">Eagle Scout</strong>, earned my engineering license, completed my MBA, and eventually found myself building a career thousands of kilometers from home, in the UAE.</p>
                  <p className="display text-lg text-ink">But those are just the milestones, not the whole story.</p>
                  <p>I&apos;ve always been the quiet type. More comfortable observing, listening, and figuring things out than being the loudest person in the room. I&apos;m curious by nature, constantly learning, and sometimes guilty of overthinking before taking the first step.</p>
                  <p>My journey hasn&apos;t been a straight line. I&apos;ve changed directions, started over, made mistakes, and discovered interests I never imagined I&apos;d pursue. From engineering and technology to building products, exploring business ideas, improving my health, and learning how to enjoy life beyond work.</p>
                  <p>I&apos;m still learning to speak up, put myself out there, and share the journey instead of waiting until everything is perfect.</p>
                  <blockquote className="display mt-2 rounded-2xl border border-blue/20 bg-gradient-to-br from-blue/10 to-accent/10 p-5 text-xl leading-snug text-ink">This is more than my resume. It&apos;s the story of where I started, what I&apos;ve learned, and the person I&apos;m still becoming.</blockquote>
                </div>
              </div>
            </div>
            <div className="group md:sticky md:top-28">
              <div className="rounded-[1.9rem] bg-gradient-to-br from-blue via-accent to-blue p-[3px] shadow-2xl transition duration-500 group-hover:-rotate-1 group-hover:scale-[1.02]">
                <Image src="/img/mark-about.webp" alt="Mark Gomez in the office" width={900} height={900} className="w-full rounded-[1.75rem] object-cover" />
              </div>
              <p className="mx-auto mt-5 w-fit rounded-full border border-line bg-card px-5 py-2 text-center text-sm font-medium text-ink/90 shadow-sm">Building, learning and still becoming.</p>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="wrap py-12">
        <Reveal>
          <div className="card grid gap-8 p-8 md:grid-cols-2 md:p-12">
            <div><p className="eyebrow">How I work</p><h2 className="display mt-2 text-3xl">Quiet and independent, by default.</h2>
              <p className="mt-4 leading-relaxed text-ink/90">When I am focused on a problem I can go deep and keep moving without always sharing enough along the way. I have learned that people need visibility and context. So I share progress earlier and ask for input before things feel perfect.</p></div>
            <div><p className="eyebrow">What I value</p><h2 className="display mt-2 text-3xl">Understand the problem first.</h2>
              <p className="mt-4 leading-relaxed text-ink/90">Understand the product, the people using it and the problem. Then keep making it better. I try not to hide behind frameworks and vocabulary.</p></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
