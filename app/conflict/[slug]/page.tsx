import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdInContent from "@/components/ads/AdInContent";
import type { Metadata } from "next";

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

async function getConflicts(): Promise<Conflict[]> {
  const filePath = path.join(process.cwd(), "public/data/conflicts.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function generateStaticParams() {
  const conflicts = await getConflicts();
  return conflicts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/conflict/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const conflicts = await getConflicts();
  const conflict = conflicts.find((c) => c.slug === slug);
  if (!conflict) return {};
  return {
    title: `${conflict.name} — Proxy War Watch`,
    description: conflict.description,
  };
}

const EVIDENCE_COLOR: Record<string, string> = {
  confirmed: "bg-red-50 border-red-200 text-red-700",
  "confirmed-by-UN": "bg-red-50 border-red-200 text-red-700",
  strong: "bg-orange-50 border-orange-200 text-orange-700",
  moderate: "bg-yellow-50 border-yellow-200 text-yellow-700",
  weak: "bg-slate-100 border-slate-200 text-slate-500",
};

const statusColors: Record<string, string> = {
  active: "bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/20",
  frozen: "bg-blue-500/10 text-blue-600 ring-1 ring-inset ring-blue-500/20",
  "reduced-intensity": "bg-yellow-500/10 text-yellow-700 ring-1 ring-inset ring-yellow-500/20",
};

export default async function ConflictPage(props: PageProps<"/conflict/[slug]">) {
  const { slug } = await props.params;
  const conflicts = await getConflicts();
  const conflict = conflicts.find((c) => c.slug === slug);
  if (!conflict) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-6 inline-flex items-center gap-1">
        ← All Conflicts
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <h1 className="text-3xl font-bold text-slate-900">{conflict.name}</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[conflict.status] || "bg-slate-100 text-slate-600"}`}>
            {conflict.status.replace("-", " ")}
          </span>
        </div>
        <div className="flex gap-3 text-sm text-slate-500 flex-wrap mb-4">
          <span>{conflict.region}</span>
          <span>·</span>
          <span>Since {conflict.start_date}</span>
          <span>·</span>
          <span className="capitalize">{conflict.conflict_type}</span>
        </div>
        <p className="text-slate-600 text-base leading-relaxed">{conflict.description}</p>
      </div>

      <div className="mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Primary Parties</h2>
        <div className="flex flex-wrap gap-2">
          {conflict.primary_parties.map((p) => (
            <span key={p} className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">{p}</span>
          ))}
        </div>
      </div>

      <AdInContent />

      <h2 className="text-xl font-bold text-slate-900 mb-4">External Backers</h2>
      <div className="grid gap-4">
        {conflict.external_supporters.map((s) => (
          <div key={s.country} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.flag}</span>
                <div>
                  <Link
                    href={`/supporter/${s.country.toLowerCase().replace(/\s+/g, "-")}`}
                    className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    {s.country}
                  </Link>
                  <p className="text-sm text-slate-500 capitalize">{s.role.replace(/-/g, " ")}</p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${EVIDENCE_COLOR[s.evidence_level] || "bg-slate-100 border-slate-200 text-slate-500"}`}>
                {s.evidence_level}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.support_type.map((t) => (
                <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {conflict.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {conflict.tags.map((t) => (
            <span key={t} className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-500">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
