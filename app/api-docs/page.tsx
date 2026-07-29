import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Code2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calendar API",
  description:
    "News Bihani Nepali Calendar first-party JSON API documentation.",
};

const endpoints = [
  {
    method: "GET",
    path: "/api/calendar?year=2083&month=4",
    title: "मासिक पात्रो",
    description:
      "महिनाका सबै दिन, AD मिति, बार, शनिबार, आजको दिन र उपलब्ध पर्व वा बिदा फर्काउँछ।",
  },
  {
    method: "GET",
    path: "/api/convert?from=ad&date=2026-07-29",
    title: "AD बाट BS",
    description: "YYYY-MM-DD ढाँचाको Gregorian मिति Bikram Sambat मा बदल्छ।",
  },
  {
    method: "GET",
    path: "/api/convert?from=bs&date=2083-04-13",
    title: "BS बाट AD",
    description: "YYYY-MM-DD ढाँचाको Bikram Sambat मिति Gregorian मा बदल्छ।",
  },
  {
    method: "GET",
    path: "/api/holidays?year=2083&type=public",
    title: "बिदा तथा पर्व",
    description:
      "२०८३ का प्रमाणित मिति फर्काउँछ। type मा public, festival, regional वा observance प्रयोग गर्न सकिन्छ।",
  },
];

export default function ApiDocsPage() {
  return (
    <main className="docs-page">
      <header className="docs-header">
        <div className="page-shell docs-nav">
          <Link className="brand" href="/" aria-label="न्युज बिहानी पात्रो">
            <span className="brand-mark">
              <CalendarDays size={24} aria-hidden="true" />
            </span>
            <span className="brand-copy">
              <strong>न्युज बिहानी</strong>
              <small>API</small>
            </span>
          </Link>
          <Link className="docs-back" href="/">
            <ArrowLeft size={17} aria-hidden="true" />
            पात्रोमा फर्कनुहोस्
          </Link>
        </div>
      </header>

      <section className="docs-hero">
        <div className="page-shell">
          <span className="docs-icon">
            <Code2 size={25} aria-hidden="true" />
          </span>
          <p>FIRST-PARTY JSON API</p>
          <h1>नेपाली पात्रोका लागि सरल API</h1>
          <div className="docs-lead">
            बाह्य पात्रो सेवामा runtime dependency छैन। मिति गणना र २०८३ को
            verified event dataset यही deployment भित्रबाट चल्छ।
          </div>
        </div>
      </section>

      <div className="page-shell docs-content">
        <section aria-labelledby="quick-start">
          <h2 id="quick-start">Endpoints</h2>
          <div className="endpoint-list">
            {endpoints.map((endpoint) => (
              <article className="endpoint-card" key={endpoint.path}>
                <div className="endpoint-heading">
                  <span>{endpoint.method}</span>
                  <h3>{endpoint.title}</h3>
                </div>
                <code>{endpoint.path}</code>
                <p>{endpoint.description}</p>
                <a href={endpoint.path} target="_blank" rel="noreferrer">
                  JSON हेर्नुहोस्
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="docs-rules" aria-labelledby="api-rules">
          <h2 id="api-rules">मुख्य नियम</h2>
          <dl>
            <div>
              <dt>मिति ढाँचा</dt>
              <dd>YYYY-MM-DD</dd>
            </div>
            <div>
              <dt>BS दायरा</dt>
              <dd>२००० देखि २०९०</dd>
            </div>
            <div>
              <dt>Time zone</dt>
              <dd>Asia/Kathmandu</dd>
            </div>
            <div>
              <dt>Content type</dt>
              <dd>application/json</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
