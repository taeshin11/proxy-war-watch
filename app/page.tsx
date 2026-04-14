import type { Metadata } from 'next'
import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import NetworkDiagram from "@/components/NetworkDiagram";
import AdInContent from "@/components/ads/AdInContent";
import AdSidebar from "@/components/ads/AdSidebar";

export const metadata: Metadata = {
  title: 'Proxy War Watch | Real-Time Conflict Intelligence',
  description: 'Mapping proxy warfare networks, foreign interventions, and state sponsorship of armed groups in active conflicts',
  keywords: 'proxy war, foreign intervention, state sponsorship, arms network, proxy conflict, foreign fighters',
}

type Supporter = {
  country: string;
  flag: string;
  role: string;
  support_type: string[];
  evidence_level: string;
};

type Conflict = {
  id: string;
  slug: string;
  name: string;
  region: string;
  conflict_type: string;
  primary_parties: string[];
  external_supporters: Supporter[];
  description: string;
  start_date: string;
  status: string;
  tags: string[];
  last_updated: string;
};

const statusColors: Record<string, string> = {
  active: "text-red-600",
  frozen: "text-blue-600",
  "reduced-intensity": "text-yellow-600",
};

const evidenceColors: Record<string, string> = {
  confirmed: "bg-red-50 border-red-200 text-red-700",
  strong: "bg-orange-50 border-orange-200 text-orange-700",
  moderate: "bg-yellow-50 border-yellow-200 text-yellow-700",
};

export default async function Home() {
  const filePath = path.join(process.cwd(), "public/data/conflicts.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const conflicts: Conflict[] = JSON.parse(raw);

  const allSupporters = new Set(conflicts.flatMap(c => c.external_supporters.map(s => s.country)));
  const totalLinks = conflicts.reduce((acc, c) => acc + c.external_supporters.length, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Global Proxy Conflict Intelligence</p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div>
              <h1 className="text-4xl font-extrabold mb-4">Proxy War Watch</h1>
              <p className="text-slate-300 text-lg max-w-2xl">The hidden layer of global conflict — who funds, arms, and enables whom.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-indigo-400">{conflicts.length}</div>
                <div className="text-xs text-slate-400 mt-1">Proxy Conflicts</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-indigo-400">{allSupporters.size}</div>
                <div className="text-xs text-slate-400 mt-1">Active Supporters</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-indigo-400">{totalLinks}</div>
                <div className="text-xs text-slate-400 mt-1">Confirmed Links</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Support Network Diagram</h2>
              <p className="text-slate-500 text-sm mb-4">Visual map of who backs whom across active proxy conflicts</p>
              <NetworkDiagram conflicts={conflicts} />
            </section>

            <AdInContent />

            <section id="conflicts">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Conflicts ({conflicts.length})</h2>
              <p className="text-slate-500 text-sm mb-4">Active and frozen proxy conflicts with external backer networks</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conflicts.map((conflict) => (
                  <div key={conflict.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-6 group">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{conflict.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{conflict.region}</span>
                          <span className="text-slate-300">·</span>
                          <span className={`text-xs font-semibold ${statusColors[conflict.status] || "text-slate-500"}`}>{conflict.status}</span>
                        </div>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg border border-indigo-100 shrink-0">
                        {conflict.external_supporters.length} backers
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {conflict.external_supporters.map(s => (
                        <div key={s.country} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${evidenceColors[s.evidence_level] || "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <span>{s.flag}</span>
                          <span className="font-medium">{s.country}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{s.role}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">{conflict.description}</p>

                    <Link href={`/conflict/${conflict.slug}`} className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                      View supporter network →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <AdSidebar />
            <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Major Backers</h3>
              {["Russia", "United States", "Iran", "Turkey", "UAE", "China"].map((country) => {
                const count = conflicts.filter((c) =>
                  c.external_supporters.some((s) => s.country === country)
                ).length;
                return (
                  <Link
                    key={country}
                    href={`/supporter/${country.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-between py-2 text-sm hover:text-indigo-600 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <span className="text-slate-700">{country}</span>
                    <span className="text-slate-400 text-xs bg-slate-50 px-2 py-0.5 rounded-full">{count} conflicts</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
