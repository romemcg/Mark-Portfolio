import { Logo } from "./Logo";
import { TechIcon } from "./Icons";
import { Reveal } from "./Reveal";

const places = [["samsung", "Samsung Electro-Mechanics"], ["disruptx", "Disrupt-X"], ["aldar", "Aldar Properties"], ["terminus", "Terminus Group"]];
const urls: Record<string, string> = {"samsung": "https://www.samsungsem.com", "disruptx": "https://www.disrupt-x.io", "aldar": "https://www.aldar.com", "terminus": "https://www.terminusgroup.com"};
const about: Record<string, { what: string; role: string }> = {
  samsung: { what: "Global maker of electronic components, including MLCCs, camera modules and semiconductor substrates.", role: "Product Development Engineer, then Manager | Jul 2020 to Feb 2023" },
  disruptx: { what: "Dubai technology company building IoT and facility management platforms for corporate real estate.", role: "Product Engineer, then Product Manager | Mar 2023 to Oct 2024" },
  aldar: { what: "Abu Dhabi's leading real estate developer and manager, behind large master planned communities.", role: "Product Owner and Smart City Lead | Oct 2024 to Oct 2025" },
  terminus: { what: "Smart city and AIoT technology group building enterprise AI and IoT platforms.", role: "Product Manager, Enterprise AI and IoT Platforms | Oct 2025 to Aug 2026" },
};
const tech = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Rust", "SQLite", "Expo", "Claude"];

export function LogoStrip() {
  return (
    <Reveal className="wrap pb-12">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-soft">Where I have worked</p>
      <div className="mt-6 grid grid-cols-2 justify-items-center gap-x-6 gap-y-7 md:grid-cols-4">
        {places.map(([id, n]) => (
          <a key={id} href={urls[id]} target="_blank" rel="noopener noreferrer" aria-label={`${n} website`} className="group relative flex flex-col items-center gap-2.5 transition hover:-translate-y-0.5 focus-visible:-translate-y-0.5">
            <Logo id={id} name={n} size={72} />
            <span className="text-xs font-medium text-soft">{n.replace(" Electro-Mechanics", "").replace(" Properties", "").replace(" Group", "")}</span>
            <span role="tooltip" className="card pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-3 w-64 -translate-x-1/2 translate-y-1 p-4 text-left opacity-0 shadow-xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <span className="block text-sm font-semibold text-ink">{n}</span>
              <span className="mt-1 block text-xs leading-relaxed text-ink/90">{about[id].what}</span>
              <span className="mt-2 block text-xs font-medium text-accent">{about[id].role}</span>
            </span>
          </a>
        ))}
      </div>
    </Reveal>
  );
}

export function TechStrip() {
  return (
    <Reveal className="wrap pb-14 pt-2">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-soft">Tools I build with</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-soft">
        {tech.map((t) => <span key={t} title={t} className="flex items-center gap-2 text-sm"><TechIcon name={t} className="h-5 w-5" />{t}</span>)}
      </div>
    </Reveal>
  );
}
