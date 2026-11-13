import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CareerView } from "@/components/CareerView";
import { CareerJourney } from "@/components/CareerJourney";

export const metadata: Metadata = { title: "Career", description: "Career journey, experience, credentials and outcomes.", alternates: { canonical: "/career/" } };

export default function Career() {
  return (
    <>
      <PageHeader eyebrow="Career" title="My career journey." intro="From electronics manufacturing to smart city platforms and AI products. In a hurry? Jump straight to the Recruiter view." />
      <div className="wrap"><a href="#recruiter" className="btn btn-accent !px-5 !py-2.5 !text-sm">Recruiter view <span aria-hidden>↓</span></a></div>
      <section className="wrap py-14"><CareerJourney /></section>
      <section id="recruiter" className="wrap scroll-mt-20 py-10">
        <h2 className="display mb-6 text-3xl md:text-4xl">Recruiter view</h2>
        <CareerView />
      </section>
    </>
  );
}
