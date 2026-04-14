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
  confirmed: "bg-green-900 text-green-300",
  "confirmed-by-UN": "bg-emerald-900 text-emerald-300",
  strong: "bg-blue-900 text-blue-300",
  moderate: "bg-yellow-900 text-yellow-300",
  weak: "bg-gray-700 text-gray-400",
};

export default async function ConflictPage(props: PageProps<"/conflict/[slug]">) {
  const { slug } = await props.params;
  const conflicts = await getConflicts();
  const conflict = conflicts.find((c) => c.slug === slug);
  if (!conflict) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
        ← All Conflicts
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{conflict.name}</h1>
        <div className="flex gap-3 text-sm text-gray-400 flex-wrap">
          <span>{conflict.region}</span>
          <span>·</span>
          <span>Since {conflict.start_date}</span>
          <span>·</span>
          <span className="capitalize">{conflict.status.replace("-", " ")}</span>
          <span>·</span>
          <span className="capitalize">{conflict.conflict_type}</span>
        </div>
      </div>

      <p className="text-gray-300 text-base mb-6 leading-relaxed">{conflict.description}</p>

      <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h2 className="font-semibold text-white mb-3 text-sm">Primary Parties</h2>
        <div className="flex flex-wrap gap-2">
          {conflict.primary_parties.map((p) => (
            <span key={p} className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">{p}</span>
          ))}
        </div>
      </div>

      <AdInContent />

      <h2 className="text-xl font-semibold text-white mb-4">External Supporters</h2>
      <div className="grid gap-4">
        {conflict.external_supporters.map((s) => (
          <div key={s.country} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.flag}</span>
                <Link
                  href={`/supporter/${s.country.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-semibold text-white hover:text-orange-400 transition-colors"
                >
                  {s.country}
                </Link>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${EVIDENCE_COLOR[s.evidence_level] || "bg-gray-700 text-gray-400"}`}>
                {s.evidence_level}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2 capitalize">{s.role.replace(/-/g, " ")}</p>
            <div className="flex flex-wrap gap-1">
              {s.support_type.map((t) => (
                <span key={t} className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {conflict.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {conflict.tags.map((t) => (
            <span key={t} className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-400">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
