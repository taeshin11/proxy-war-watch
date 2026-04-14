import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
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
  primary_parties: string[];
  external_supporters: Supporter[];
  description: string;
  start_date: string;
  status: string;
};

const KNOWN_SUPPORTERS: Record<string, { name: string; flag: string }> = {
  russia: { name: "Russia", flag: "🇷🇺" },
  "united-states": { name: "United States", flag: "🇺🇸" },
  iran: { name: "Iran", flag: "🇮🇷" },
  china: { name: "China", flag: "🇨🇳" },
  turkey: { name: "Turkey", flag: "🇹🇷" },
  uae: { name: "UAE", flag: "🇦🇪" },
  "saudi-arabia": { name: "Saudi Arabia", flag: "🇸🇦" },
  nato: { name: "NATO", flag: "🏳" },
  egypt: { name: "Egypt", flag: "🇪🇬" },
  india: { name: "India", flag: "🇮🇳" },
  france: { name: "France", flag: "🇫🇷" },
  rwanda: { name: "Rwanda", flag: "🇷🇼" },
  "north-korea": { name: "North Korea", flag: "🇰🇵" },
};

async function getConflicts(): Promise<Conflict[]> {
  const filePath = path.join(process.cwd(), "public/data/conflicts.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function generateStaticParams() {
  return Object.keys(KNOWN_SUPPORTERS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/supporter/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const info = KNOWN_SUPPORTERS[slug];
  if (!info) return {};
  return {
    title: `${info.name} Proxy Involvement — Proxy War Watch`,
    description: `All conflicts where ${info.name} is an external supporter or backer.`,
  };
}

export default async function SupporterPage(props: PageProps<"/supporter/[slug]">) {
  const { slug } = await props.params;
  const info = KNOWN_SUPPORTERS[slug];
  if (!info) notFound();

  const conflicts = await getConflicts();
  const involved = conflicts.filter((c) =>
    c.external_supporters.some(
      (s) => s.country.toLowerCase().replace(/\s+/g, "-") === slug
    )
  );

  if (involved.length === 0) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
        ← All Conflicts
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{info.flag}</span>
        <div>
          <h1 className="text-3xl font-bold text-white">{info.name}</h1>
          <p className="text-gray-400 text-sm mt-1">External involvement in {involved.length} conflict{involved.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {involved.map((c) => {
          const role = c.external_supporters.find(
            (s) => s.country.toLowerCase().replace(/\s+/g, "-") === slug
          );
          return (
            <Link
              key={c.id}
              href={`/conflict/${c.slug}`}
              className="block bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{c.name}</h3>
                <span className="text-xs text-gray-400 ml-2 capitalize">
                  {c.status.replace("-", " ")}
                </span>
              </div>
              {role && (
                <>
                  <p className="text-sm text-orange-400 mb-2 capitalize">{role.role.replace(/-/g, " ")}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.support_type.map((t) => (
                      <span key={t} className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300">{t}</span>
                    ))}
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
