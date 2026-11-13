"use client";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/data";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/Icons";

// QR for https://mark-gomez.vercel.app/contact/ (29x29, ECC M). Regenerate if the URL changes.
const QR = ["11111110101101011010001111111","10000010010001001111101000001","10111010001000001111001011101","10111010111101011010101011101","10111010101110111010001011101","10000010101100001001001000001","11111110101010101010101111111","00000000110110111110100000000","10001011100111100101111111001","11001000100100111110001011111","10101110001001111110000010001","10111001111011010101101111011","01001011011011001111010000010","00000100010001111110001111111","00101110001110011010001111101","11110001101100100101100100011","00100110011011110100110100010","11011001001100011010101111011","00101011100101110100000000101","00001100010101000111000100011","11011111101101010100111111001","00000000111101111000100010001","11111110100000010101101011101","10000010001100101101100010010","10111010100011100101111111010","10111010010110011000110000001","10111010001010010101010001111","10000010000111100100100001011","11111110111100010110110101010"];
const qrPath = QR.flatMap((row, y) => [...row].map((v, x) => (v === "1" ? `M${x},${y}h1v1h-1z` : ""))).join("");

export const CARD_TITLE = "Product Manager";
export const CARD_FOCUS = "Technology · Business · Delivery";

function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div className={`bc-face absolute inset-0 overflow-hidden rounded-[20px] ${back ? "bc-back" : ""}`}>
      <div aria-hidden className="bc-grid absolute inset-0" />
      <div aria-hidden className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3b82f6]/25 blur-3xl" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function BusinessCard() {
  const [flipped, setFlipped] = useState(false);
  const rows = [
    { href: `mailto:${site.email}`, label: site.email, icon: <MailIcon className="h-3.5 w-3.5" /> },
    { href: `tel:${site.phone}`, label: site.phoneDisplay, icon: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg> },
    { href: site.linkedin, label: "linkedin.com/in/romemcg", icon: <LinkedinIcon className="h-3.5 w-3.5" /> },
    { href: site.github, label: "github.com/romemcg", icon: <GithubIcon className="h-3.5 w-3.5" /> },
  ];
  return (
    <div className="w-full max-w-[460px]">
      <div className="bc-scene relative h-[236px] w-full sm:h-auto sm:aspect-[1.6/1]">
        <div className={`bc-inner relative h-full w-full ${flipped ? "is-flipped" : ""}`}>
          <Face>
            <div className="flex h-full flex-col justify-between p-5 sm:p-7" aria-hidden={flipped}>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                  <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#60a5fa,#38bdf8,#1e3a8a,#38bdf8,#60a5fa)]" />
                  <Image src="/img/mark-card.webp" alt="Mark Gomez" width={160} height={160} className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] rounded-full object-cover" />
                </div>
                <div className="min-w-0 pt-1">
                  <p className="font-display text-xl font-semibold leading-tight text-white sm:text-2xl">{site.seoName}</p>
                  <p className="mt-1 text-sm font-medium text-[#93c5fd]">{CARD_TITLE}</p>
                  <p className="mt-0.5 text-xs text-white/55">{CARD_FOCUS}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mg-logo.svg" alt="" aria-hidden className="ml-auto hidden h-9 w-9 shrink-0 drop-shadow-[0_4px_12px_rgba(56,189,248,0.35)] min-[400px]:block" />
              </div>
              <ul className="space-y-1.5">
                {rows.map((r) => (
                  <li key={r.label}>
                    <a href={r.href} tabIndex={flipped ? -1 : 0} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="inline-flex max-w-full items-center gap-2.5 text-[13px] text-white/80 transition hover:text-white">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-[#93c5fd]">{r.icon}</span>
                      <span className="truncate">{r.label}</span>
                    </a>
                  </li>
                ))}
                <li className="pl-[34px] text-[12px] text-white/45">Dubai, {site.base}</li>
              </ul>
            </div>
          </Face>
          <Face back>
            <div className="flex h-full items-center gap-5 p-5 sm:gap-7 sm:p-7" aria-hidden={!flipped}>
              <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-lg">
                <svg viewBox="0 0 29 29" className="h-28 w-28 sm:h-36 sm:w-36" shapeRendering="crispEdges" role="img" aria-label="QR code linking to mark-gomez.vercel.app/contact">
                  <path fill="#0b1730" d={qrPath} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-white">Scan to connect</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">Opens this page on your phone, where you can save my contact in one tap.</p>
                <p className="mt-3 truncate text-xs text-[#93c5fd]">mark-gomez.vercel.app</p>
              </div>
            </div>
          </Face>
        </div>
      </div>
      <button type="button" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} className="mx-auto mt-4 flex items-center gap-2 text-sm font-medium text-soft transition hover:text-accent">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>
        {flipped ? "Show front" : "Flip for QR code"}
      </button>
    </div>
  );
}
