import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import NetworkDiagram from "@/components/NetworkDiagram";
import AdInContent from "@/components/ads/AdInContent";
import AdSidebar from "@/components/ads/AdSidebar";

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

const STATUS_COLOR: Record<string, string> = {
  active: "bg-red-900 text-red-300",
  frozen: "bg-blue-900 text-blue-300",
  "reduced-intensity": "bg-yellow-900 text-yellow-300",
};

export default async function Home() {
  const filePath = path.join(process.cwd(), "public/data/conflicts.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const conflicts: Conflict[] = JSON.parse(raw);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Who Backs Whom</h1>
        <p className="text-gray-400 max-w-2xl">
          Proxy conflict network — track external supporters, support types, and evidence levels
          across {conflicts.length} active and frozen conflicts worldwide.
        </p>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Support Network Diagram</h2>
            <NetworkDiagram conflicts={conflicts} />
          </section>

          <AdInContent />

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Conflicts ({conflicts.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conflicts.map((c) => (
                <Link
                  key={c.id}
                  href={`/conflict/${c.slug}`}
                  className="block bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${STATUS_COLOR[c.status] || "bg-gray-700 text-gray-300"}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{c.region} · Since {c.start_date.slice(0, 4)}</p>
                  <p className="text-xs text-gray-300 mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.external_supporters.slice(0, 4).map((s) => (
                      <span key={s.country} className="text-xs bg-gray-800 px-2 py-0.5 rounded" title={s.role}>
                        {s.flag} {s.country}
                      </span>
                    ))}
                    {c.external_supporters.length > 4 && (
                      <span className="text-xs text-gray-500">+{c.external_supporters.length - 4} more</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdSidebar />
          <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3 text-sm">Major Supporters</h3>
            {["Russia", "United States", "Iran", "Turkey", "UAE", "China"].map((country) => {
              const count = conflicts.filter((c) =>
                c.external_supporters.some((s) => s.country === country)
              ).length;
              return (
                <Link
                  key={country}
                  href={`/supporter/${country.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center justify-between py-1.5 text-sm hover:text-orange-400 transition-colors"
                >
                  <span className="text-gray-300">{country}</span>
                  <span className="text-gray-500 text-xs">{count} conflicts</span>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
