import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Proxy War Watch",
  description: "About Proxy War Watch and our data sources.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">About Proxy War Watch</h1>
      <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
        <p>
          Proxy War Watch tracks external state involvement in armed conflicts — who funds, arms, trains,
          or provides intelligence to conflict parties without direct participation.
        </p>
        <p>
          Data is aggregated from open-source intelligence (OSINT), United Nations reports and Panel of
          Experts findings, investigative journalism from Reuters, AP, and regional outlets, and
          government declassifications.
        </p>
        <p>
          Evidence levels reflect assessments from primary sources:
        </p>
        <ul className="space-y-1 text-sm">
          <li><strong className="text-green-400">Confirmed</strong> — Multiple independent sources, government admissions, or physical evidence</li>
          <li><strong className="text-blue-400">Strong</strong> — Substantial evidence, minor dispute</li>
          <li><strong className="text-yellow-400">Moderate</strong> — Credible but limited sourcing</li>
          <li><strong className="text-gray-400">Weak</strong> — Allegations with minimal corroboration</li>
        </ul>
        <p className="text-gray-400 text-sm">
          Last updated: April 2026. This site is for informational purposes only.
        </p>
      </div>
    </div>
  );
}
