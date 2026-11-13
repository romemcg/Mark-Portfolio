"use client";
import { usePathname } from "next/navigation";

// Home page announcement bar linking to the standalone interactive Digital Twin case study (public/case-study/).
export function CaseStudyBanner() {
  const path = usePathname();
  if (path !== "/") return null;
  return (
    <a href="/case-study/" className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-center text-[13px] font-semibold leading-snug tracking-wide" style={{ background: "#0A162E", color: "#F2F5FB" }}>
      <span className="rounded-full px-2.5 py-0.5 text-[11px] tracking-[.08em]" style={{ background: "#60A5FA", color: "#070E1C" }}>NEW</span>
      <span>Interactive case study: From Physical Assets to Autonomous Operations</span>
      <span aria-hidden style={{ color: "#60A5FA" }}>→</span>
    </a>
  );
}
