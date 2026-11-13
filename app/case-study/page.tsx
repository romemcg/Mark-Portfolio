import type { Metadata } from "next";
import { CaseStudy } from "@/components/building/CaseStudy";

export const metadata: Metadata = {
  title: "From Physical Assets to Autonomous Operations",
  description: "An interactive, scroll driven digital twin case study: one building followed from physical assets to telemetry, context, anomaly detection, supervised decisions and a simulated operational scenario.",
  alternates: { canonical: "/case-study/" },
};

export default function Page() {
  return <CaseStudy />;
}
