import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Feature({ title, body, cta, href, reverse, children }: { title: string; body: string; cta?: string; href?: string; reverse?: boolean; children: ReactNode }) {
  return (
    <Reveal className="wrap py-4 md:py-5">
      <div className="grid items-center gap-8 rounded-[2rem] bg-tint p-6 md:grid-cols-2 md:gap-14 md:p-14">
        <div className={reverse ? "md:order-2" : ""}>
          <h2 className="display text-3xl md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink/90">{body}</p>
          {cta && href && <Link href={href} className="btn btn-accent mt-6 !px-5 !py-2.5 !text-sm">{cta}</Link>}
        </div>
        <div className={reverse ? "md:order-1" : ""}>{children}</div>
      </div>
    </Reveal>
  );
}
