import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { DeliveryProjects } from "@/components/DeliveryProjects";
import { ProjectExplorer } from "@/components/ProjectExplorer";

export const metadata: Metadata = { title: "Projects", description: "Products Mark Gomez builds and explores, plus the work behind his roles.", alternates: { canonical: "/projects/" } };

export default function Projects() {
  return (
    <>
      <PageHeader eyebrow="Projects" title="Things I've built and explored." intro="Personal products I build to learn, and the work behind my roles." />
      <section className="wrap py-8"><ProjectExplorer /></section>
      <DeliveryProjects />
    </>
  );
}
