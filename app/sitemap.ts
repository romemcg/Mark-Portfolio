import type { MetadataRoute } from "next";
import { caseStudies, projects, site } from "@/content/data";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = ["", "about", "career", "projects", "case-studies", "case-study", "now", "recommendations", "contact"].map((p) => `${site.url}/${p}${p ? "/" : ""}`);
  const more = [...projects.map((p) => `${site.url}/projects/${p.slug}/`), ...caseStudies.map((c) => `${site.url}/case-studies/${c.slug}/`)];
  return [...base, ...more].map((url) => ({ url }));
}
