import Image from "next/image";

// Logo tiles are baked into images (public/logos/tiles) so no CSS background colour is involved.
// Browsers that force their own colours (Brave Night Mode, Dark Reader) cannot turn the tile dark.
const ids = ["samsung", "aldar", "disruptx", "terminus", "ub", "pcu"];

export function Logo({ id, name, size = 56, square }: { id: string; name: string; src?: string; size?: number; square?: boolean }) {
  if (!ids.includes(id)) return null;
  const kind = square ? "square" : "wide";
  return (
    <span className="inline-block shrink-0 overflow-hidden rounded-2xl border border-line/10 shadow-sm" role="img" aria-label={`${name} logo`}
      style={{ height: size, width: square ? size : size * 2 }}>
      <Image src={`/logos/tiles/${id}-${kind}.png`} alt="" width={square ? 240 : 480} height={240} style={{ width: "100%", height: "100%", display: "block" }} />
    </span>
  );
}
