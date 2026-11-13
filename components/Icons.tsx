import { siNextdotjs, siReact, siTypescript, siTailwindcss, siRust, siSqlite, siTauri, siExpo, siVercel, siGithub, siAnthropic, siShadcnui, siGmail, siBluetooth } from "simple-icons";

const map: Record<string, { path: string }> = {
  "Next.js": siNextdotjs, React: siReact, TypeScript: siTypescript, "Tailwind CSS": siTailwindcss, Rust: siRust, SQLite: siSqlite,
  "Tauri 2": siTauri, Expo: siExpo, "React Native": siReact, Vercel: siVercel, GitHub: siGithub, Claude: siAnthropic, "shadcn/ui": siShadcnui, BLE: siBluetooth,
};
export const hasIcon = (n: string) => !!map[n];

export function TechIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const i = map[name];
  if (!i) return null;
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d={i.path} /></svg>;
}
export function GithubIcon({ className = "h-5 w-5" }: { className?: string }) { return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d={siGithub.path} /></svg>; }
export function MailIcon({ className = "h-5 w-5" }: { className?: string }) { return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d={siGmail.path} /></svg>; }
export function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>;
}
