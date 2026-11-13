import { TechIcon, hasIcon } from "./Icons";

const hues = [["#2563EB", "#38BDF8"], ["#4F46E5", "#60A5FA"], ["#0284C7", "#22D3EE"], ["#1D4ED8", "#818CF8"], ["#0891B2", "#3B82F6"], ["#1E3A8A", "#0EA5E9"]];
const glyph: Record<string, string> = {
  "personal-ai-learning-studio": '<path d="M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3zM12 6v15M6 8h3M6 11h3"/><path d="M16 9l3 2-3 2z"/>',
  "smart-city-intelligence-hub": '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M10 10.5L6.5 7.5M14 10.5l3.5-3M10 13.5l-3.5 3M14 13.5l3.5 3"/>',
  "life-os": '<path d="M3 20h5v-5h5v-5h5V5h3"/><circle cx="18" cy="5" r="1.2"/>',
  careeros: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 14l2 2 4-4"/>',
  "gulf-hiring-radar": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/><circle cx="12" cy="12" r="1"/>',
  "wakeful-morning": '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M5 3L2 6M19 3l3 3"/>',
  "aldar-connected-communities": '<path d="M3 21h18M5 21V7l7-4v18M19 21V11l-7-4M9 9h1M9 13h1M9 17h1M15 13h1M15 17h1"/>',
  "terminus-presales-programmes": '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12v10M12 12L3 7"/>',
  "disrupt-x-iot-platforms": '<path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="19" r="1.2"/><path d="M2 8.5a15 15 0 0 1 20 0"/>',
  "smart-city-solution-blueprint": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9M14 13h4M14 17h4"/>',
  "personal-execution-system": '<path d="M3 20h5v-5h5v-5h5V5h3"/><circle cx="18" cy="5" r="1.2"/>',
  "ai-that-cannot-invent": '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  "smart-education-smart-cities": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  "live-aldar-app-review": '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2M9 7h6M9 11h6"/>',
  "ai-maintenance-queue": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  "ai-resident-services": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10l2.5 2.5L16 8"/>',
  "ai-manufacturing-experiments": '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M8 15h8"/>',
  "ai-menu-to-meal": '<path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7M6 7h4M18 3c-2 1-3 4-3 7h3v11"/>',
  "disrupt-x-marketplace": '<path d="M4 9l1-5h14l1 5M4 9h16v11H4zM9 20v-6h6v6"/>',
};
const covers: Record<string, string> = {
  "arte-creative-hub": "/img/projects/arte-cover.webp",
  "smart-city-intelligence-hub": "/img/projects/hub-home.webp",
  "life-os": "/img/projects/lifeos-dashboard.webp",
  careeros: "/img/projects/careeros-match.webp",
  "gulf-hiring-radar": "/img/projects/radar-openings.webp",
};
export function ProjectCover({ index, tech, title, slug }: { index: number; tech: string[]; title: string; slug?: string; short?: boolean }) {
  if (slug && covers[slug]) {
    return (
      <div className="relative h-40 overflow-hidden rounded-2xl bg-[#0B0710]" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={covers[slug]} alt="" className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />
      </div>
    );
  }
  const icons = tech.filter(hasIcon).slice(0, 4);
  const g = hues[index % hues.length];
  return (
    <div className="relative flex h-40 items-end justify-between overflow-hidden rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }} aria-hidden>
      <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15" />
      <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3">
        {icons.map((t) => <TechIcon key={t} name={t} className="h-6 w-6 opacity-95" />)}
      </div>
      {slug && glyph[slug] && (
        <svg viewBox="0 0 24 24" className="relative h-16 w-16 shrink-0 opacity-95" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: glyph[slug] }} />
      )}
    </div>
  );
}
