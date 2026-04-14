import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

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
  return routing.locales.flatMap(locale =>
    Object.keys(KNOWN_SUPPORTERS).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const info = KNOWN_SUPPORTERS[slug];
  if (!info) return {};
  return {
    title: `${info.name} Proxy Involvement — Proxy War Watch`,
    description: `All conflicts where ${info.name} is an external supporter or backer.`,
  };
}

export default async function SupporterPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
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
      <Link href={`/${locale}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-6 inline-flex items-center gap-1">
        ← All Conflicts
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{info.flag}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{info.name}</h1>
          <p className="text-slate-500 text-sm mt-1">External involvement in {involved.length} conflict{involved.length !== 1 ? "s" : ""}</p>
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
              href={`/${locale}/conflict/${c.slug}`}
              className="block bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{c.name}</h3>
                <span className="text-xs text-slate-400 ml-2 capitalize">
                  {c.status.replace("-", " ")}
                </span>
              </div>
              {role && (
                <>
                  <p className="text-sm text-indigo-600 mb-3 capitalize font-medium">{role.role.replace(/-/g, " ")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.support_type.map((t) => (
                      <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{t}</span>
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
