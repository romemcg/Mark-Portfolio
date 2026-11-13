import Link from "next/link";
export default function NotFound() {
  return <section className="wrap py-32"><p className="eyebrow">oops</p><h1 className="display text-6xl">Page not found.</h1><p className="mt-4"><Link className="underline" href="/">Back home</Link></p></section>;
}
