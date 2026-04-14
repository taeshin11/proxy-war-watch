import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Proxy War Watch",
  description: "About Proxy War Watch and our data sources.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About Proxy War Watch</h1>
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          Proxy War Watch tracks external state involvement in armed conflicts — who funds, arms, trains,
          or provides intelligence to conflict parties without direct participation.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Data is aggregated from open-source intelligence (OSINT), United Nations reports and Panel of
          Experts findings, investigative journalism from Reuters, AP, and regional outlets, and
          government declassifications.
        </p>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 mb-3">Evidence Levels</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 border border-red-200 text-red-700 mt-0.5 shrink-0">Confirmed</span>
              <span className="text-slate-600">Multiple independent sources, government admissions, or physical evidence</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-700 mt-0.5 shrink-0">Strong</span>
              <span className="text-slate-600">Substantial evidence, minor dispute</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 border border-yellow-200 text-yellow-700 mt-0.5 shrink-0">Moderate</span>
              <span className="text-slate-600">Credible but limited sourcing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-500 mt-0.5 shrink-0">Weak</span>
              <span className="text-slate-600">Allegations with minimal corroboration</span>
            </li>
          </ul>
        </div>

        <p className="text-slate-400 text-sm">
          Last updated: April 2026. This site is for informational purposes only.
        </p>
      </div>
    </div>
  );
}
