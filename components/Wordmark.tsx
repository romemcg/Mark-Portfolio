import Link from "next/link";

export function Wordmark({ onClick, large }: { onClick?: () => void; large?: boolean }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Mark Gomez, home" className="inline-flex items-baseline whitespace-nowrap" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, letterSpacing: "-0.01em", fontSize: large ? "1.7rem" : "1.35rem", lineHeight: 1 }}>
      Mark Gomez<span className="text-accent">.</span>
    </Link>
  );
}
