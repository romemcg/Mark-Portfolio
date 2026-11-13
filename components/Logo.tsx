import Image from "next/image";

// Real logos in public/logos. Light-on-transparent marks sit on a navy tile, the rest on white.
const logos: Record<string, { src: string; w: number; h: number; dark?: boolean }> = {
  samsung: { src: "/logos/samsung.png", w: 600, h: 200 },
  aldar: { src: "/logos/aldar.png", w: 600, h: 622 },
  disruptx: { src: "/logos/disruptx.png", w: 155, h: 40 },
  terminus: { src: "/logos/terminus.png", w: 174, h: 22, dark: true },
  ub: { src: "/logos/ub.png", w: 437, h: 437 },
  pcu: { src: "/logos/pcu.png", w: 313, h: 312 },
};

export function Logo({ id, name, size = 56, square }: { id: string; name: string; src?: string; size?: number; square?: boolean }) {
  const l = logos[id];
  if (!l) return null;
  return (
    <span className="inline-grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-line/10 shadow-sm" role="img" aria-label={`${name} logo`}
      style={{ background: l.dark ? "#0C2340" : "#fff", height: size, width: square ? size : size * 2, padding: square ? size * 0.1 : `${size * 0.16}px ${size * 0.2}px` }}>
      <Image src={l.src} alt="" width={l.w} height={l.h} style={l.w / l.h > 2 ? { width: "100%", height: "auto" } : { height: square ? "100%" : size * 0.68, width: "auto" }} />
    </span>
  );
}
