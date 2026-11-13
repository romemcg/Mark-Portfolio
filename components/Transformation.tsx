import Image from "next/image";
import { transformation as t } from "@/content/data";

export function Transformation() {
  return (
    <div className="card flex items-end justify-center gap-6 p-6 md:gap-10 md:p-8">
      <figure className="text-center">
        <Image src="/img/before-2.webp" alt="Mark before, in casual wear" width={144} height={360} className="mx-auto h-56 w-auto md:h-72" />
        <figcaption className="display mt-3 text-3xl text-soft">{t.from}</figcaption>
      </figure>
      <span aria-hidden className="mb-14 text-3xl text-accent">→</span>
      <figure className="text-center">
        <Image src="/img/after-2.webp" alt="Mark after, seated in a blazer" width={258} height={360} className="mx-auto h-56 w-auto md:h-72" />
        <figcaption className="display grad mt-3 text-3xl">{t.to}</figcaption>
      </figure>
    </div>
  );
}
