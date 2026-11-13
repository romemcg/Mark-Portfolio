"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

// value like "~40%": animates the number, keeps the prefix and suffix
export function CountUp({ value }: { value: string }) {
  const m = value.match(/^(\D*)(\d+)(\D*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(m ? 0 : 0);
  useEffect(() => {
    if (!m || !inView) return;
    const target = parseInt(m[2], 10);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1200);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]); // eslint-disable-line
  if (!m) return <span>{value}</span>;
  return <span ref={ref} aria-label={value}>{m[1]}{inView ? n : m[2]}{m[3]}</span>;
}
