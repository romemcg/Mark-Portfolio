import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TechBackground } from "@/components/TechBackground";
import { Nav } from "@/components/Nav";
import { CaseStudyBanner } from "@/components/CaseStudyBanner";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { site } from "@/content/data";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.seoName} | Technical Product Manager, AIoT and Smart City Platforms`, template: `%s | ${site.seoName}` },
  description: "Mark Jerome Gomez is a technical product manager based in the UAE. AI products with guardrails, AI agents, AIoT and digital platforms, smart cities, and things he builds.",
  openGraph: { title: site.seoName, description: site.tagline, siteName: site.seoName, type: "website", images: [{ url: `${site.url}/img/og-cover.jpg`, width: 1200, height: 630, alt: "Mark Jerome Gomez, technical product manager" }] },
  twitter: { card: "summary_large_image", title: site.seoName, description: site.tagline, images: [`${site.url}/img/og-cover.jpg`] },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { themeColor: "#070E1C", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org", "@type": "Person", name: site.fullName, alternateName: site.name, url: site.url,
    email: site.email, sameAs: [site.linkedin, site.github], address: { "@type": "PostalAddress", addressCountry: "AE" },
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "University of Batangas" }, { "@type": "CollegeOrUniversity", name: "Philippine Christian University" }],
    jobTitle: "Technical Product Manager, AIoT and Smart City Platforms", knowsAbout: ["AI product management", "Large language models", "AI agents", "AIoT", "Digital twins", "Smart cities", "IoT"],
  };
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />
        <noscript><style>{`[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style></noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Providers>
          <CaseStudyBanner />
          <Nav />
          <TechBackground />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
        <script dangerouslySetInnerHTML={{ __html: "window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};" }} />
        <script defer src="/_vercel/insights/script.js" />
      </body>
    </html>
  );
}
