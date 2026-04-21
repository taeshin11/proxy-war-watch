# Proxy War Watch — PRD

> Short Title: Track Which Powers Are Backing Which Sides in Global Conflicts
> Last Updated: 2026-04-14

---

## Overview

Proxy War Watch is a geopolitical intelligence platform that maps the hidden architecture of modern warfare — who is backing whom, with what, and why. As direct great-power confrontation remains politically costly, the US, Russia, China, Iran, and Turkey increasingly fight their rivalries through proxies: arming, funding, training, and providing intelligence to local forces on behalf of their strategic interests. This platform makes those relationships transparent and explorable.

The core data model centres on conflicts (e.g. Ukraine, Yemen, Sudan, Gaza) and supporters (e.g. United States, Russia, Iran). Each conflict has a detail page listing all external backers with their role type (weapons supplier, financial backer, intelligence partner, direct fighter), support level, and geopolitical motivation. Each supporter has a profile page showing every conflict they are currently involved in, enabling users to understand the full strategic footprint of a given great power.

The platform is designed to counter the fragmented, hard-to-synthesise nature of proxy war reporting. While individual news articles cover "US sends weapons to Ukraine" or "Iran backs Houthis in Yemen," no single resource shows the full picture — until now. Proxy War Watch provides that connective tissue, making it valuable to researchers, journalists, policy students, and engaged citizens who want to understand the structural logic of contemporary conflict.

---

## Target Users & Pain Points

| User Type | Pain Point | How This Solves It |
|---|---|---|
| Policy analyst / think-tank researcher | Proxy relationships are spread across dozens of sources and hard to synthesise | Single platform maps all proxy relationships with source attribution |
| Journalist / war correspondent | Needs to quickly understand who's backing whom before writing a story | Conflict detail pages list all supporters with role types and motivations |
| Student / educator | Textbooks are outdated; no free visual resource for proxy war dynamics | Free, structured, multilingual platform for learning and research |
| Politically engaged citizen | Confused about why multiple countries seem to be involved in every conflict | Plain-language supporter motivations and role descriptions |
| NGO / peace researcher | Needs to understand who has leverage to broker ceasefires | Supporter pages show full portfolio of proxy involvement |
| News consumer following Ukraine/Gaza/Yemen | Wants to know who is really fighting and who is enabling them | Dedicated conflict pages with full backer list and roles |

---

## Tech Stack

- Framework: Next.js 15 (App Router, SSG)
- Styling: Tailwind CSS
- i18n: next-intl (8 languages: en, ar, ru, zh, fr, uk, de, es)
- Data: JSON files in /public/data/ (conflicts.json)
- Network visualisation: D3.js or react-force-graph (optional: supporter-conflict network graph)
- Ads: Adsterra + Google AdSense ca-pub-7098271335538021
- Deployment: Vercel free tier
- Domain: proxy-war-watch.vercel.app

---

## Pages & Routes

### `[locale]/` — Homepage
- Hero: "Who Is Backing Whom? — Proxy War Tracker 2026"
- Active proxy conflicts list with supporter count and intensity
- Visual summary: supporter × conflict matrix (grid showing which powers back which conflicts)
- Top supporter profiles (US, Russia, China, Iran, Turkey quick-links)
- Latest updates / changes in proxy relationships
- Language switcher

### `[locale]/conflict/[slug]/` — Conflict Detail Page
- Conflict name, location, start date, status (active / frozen / ended)
- Conflict summary paragraph (2–3 sentences)
- Sides: Side A and Side B (or multi-sided) with their external supporters
- Supporters table per side:
  - Supporter name and flag
  - Role: weapons supplier / financial backer / intelligence partner / direct military presence / diplomatic support
  - Support level: low / moderate / significant / critical
  - Geopolitical motivation (1–2 sentences)
  - Support start date
- Proxy depth score (how much of the conflict is driven by external actors vs. local forces)
- Related conflicts (same region or same supporters)
- SEO title: "[Conflict Name] — Who Is Backing Each Side? | Proxy War Watch"

### `[locale]/supporter/[slug]/` — Supporter Profile Page
- Supporter name, flag, type (nation-state / alliance / non-state actor)
- Brief profile: geopolitical posture, key alliances, strategic interests
- All conflicts this supporter is currently backing (table format):
  - Conflict name
  - Side being supported
  - Role type
  - Support level
  - Since date
- Total active proxy involvements count
- Historical proxy involvements (if status = ended)
- Related supporters (allies or rivals)
- SEO title: "[Supporter] Proxy Wars 2026 — All Conflicts They're Backing | Proxy War Watch"

### `[locale]/about/` — About Page
- Why proxy wars matter
- How supporter roles are classified
- Data sources and editorial methodology
- What this platform does not claim to do (not classified intelligence)

### `[locale]/faq/` — FAQ Page
- What counts as a proxy war?
- How do you define "supporter" vs direct participant?
- Who is backing Ukraine?
- Who is backing the Houthis in Yemen?
- How often is the data updated?

### `[locale]/privacy/` — Privacy Policy
- Cookie and ad network disclosures
- GDPR compliance

### `api/` — Internal API Routes
- `api/conflicts` — returns all conflicts from conflicts.json
- Supports ?supporter= and ?region= query params
- Supporter pages derive data from conflicts.json (supporter entries embedded in conflict records)

---

## Data Model

### `public/data/conflicts.json`
```json
[
  {
    "slug": "ukraine-russia",
    "name": "Russia-Ukraine War",
    "region": "Eastern Europe",
    "countries": ["Ukraine", "Russia"],
    "startDate": "2022-02-24",
    "status": "active",
    "intensity": "high",
    "summary": "Russia's full-scale invasion of Ukraine has drawn in dozens of external backers on both sides, making it the most heavily proxied conflict in Europe since World War II.",
    "proxyDepthScore": 82,
    "sides": [
      {
        "label": "Ukraine",
        "supporters": [
          {
            "slug": "united-states",
            "name": "United States",
            "flag": "us",
            "role": "weapons-supplier",
            "subRoles": ["financial-backer", "intelligence-partner"],
            "supportLevel": "critical",
            "motivation": "Countering Russian expansion in Europe, maintaining NATO credibility, weakening Russian military capacity.",
            "since": "2022-02-24"
          },
          {
            "slug": "germany",
            "name": "Germany",
            "flag": "de",
            "role": "weapons-supplier",
            "subRoles": ["financial-backer"],
            "supportLevel": "significant",
            "motivation": "European security, NATO obligations, and post-invasion shift in German defence posture.",
            "since": "2022-04-01"
          }
        ]
      },
      {
        "label": "Russia",
        "supporters": [
          {
            "slug": "iran",
            "name": "Iran",
            "flag": "ir",
            "role": "weapons-supplier",
            "subRoles": [],
            "supportLevel": "significant",
            "motivation": "Weakening Western military capacity, testing sanctions evasion pathways, drone technology revenue.",
            "since": "2022-09-01"
          },
          {
            "slug": "north-korea",
            "name": "North Korea",
            "flag": "kp",
            "role": "weapons-supplier",
            "subRoles": ["direct-military-presence"],
            "supportLevel": "significant",
            "motivation": "Cash payments and technology transfers in exchange for artillery shells and troops.",
            "since": "2024-06-01"
          }
        ]
      }
    ],
    "relatedConflicts": ["georgia-russia", "moldova-transnistria"],
    "lastUpdated": "2026-04-10"
  }
]
```

**Role types:** `weapons-supplier`, `financial-backer`, `intelligence-partner`, `direct-military-presence`, `diplomatic-support`, `training-provider`, `logistical-support`
**Support levels:** `minimal`, `low`, `moderate`, `significant`, `critical`
**Conflict status:** `active`, `frozen`, `ceasefire`, `ended`
**Intensity:** `low`, `moderate`, `high`, `extreme`

---

## Milestones & Git Push Points

| Milestone | Description | Deliverable |
|---|---|---|
| M0 | Project scaffold | Next.js 15 + Tailwind + next-intl, Vercel deploy confirmed |
| M1 | Data layer | conflicts.json with 15+ active proxy conflicts, all supporters populated |
| M2 | Homepage | Conflict list, supporter matrix, top supporter quick-links |
| M3 | Conflict detail pages | conflict/[slug] with sides, supporters table, proxy depth score |
| M4 | Supporter pages | supporter/[slug] derived from conflicts.json, full portfolio view |
| M5 | i18n | All 8 language files complete, RTL for Arabic, Ukrainian locale |
| M6 | Ads + launch | AdSense/Adsterra, FAQ/About/Privacy, sitemap, final Vercel push |

---

## Agent Team

### Frontend Agent
- Responsibilities: Conflict card components, supporter table layout, sides comparison UI, supporter profile page, supporter × conflict matrix visualisation, responsive layout
- Key files: `app/[locale]/page.tsx`, `app/[locale]/conflict/[slug]/page.tsx`, `app/[locale]/supporter/[slug]/page.tsx`, `components/ConflictCard.tsx`, `components/SupporterTable.tsx`, `components/SupporterMatrix.tsx`

### Backend / Data Agent
- Responsibilities: conflicts.json schema design and population, supporter slug generation, API route, data validation (all supporter slugs resolvable)
- Key files: `public/data/conflicts.json`, `app/api/conflicts/route.ts`

### SEO / Content Agent
- Responsibilities: Conflict summary paragraphs, supporter motivation text, FAQ answers (especially "who is backing Ukraine/Yemen/Gaza"), meta tags, OG images, sitemap, translations
- Key files: `app/[locale]/faq/page.tsx`, `messages/en.json`, `app/sitemap.ts`

### QA Agent
- Responsibilities: All conflict/[slug] pages resolve, all supporter/[slug] pages resolve (derived from conflicts.json), supporter matrix renders correctly, mobile layout verified
- Key files: `tests/`, Vercel preview URL checks

---

## SEO Strategy

| Target Keyword | Monthly Search Volume (est.) | Page |
|---|---|---|
| proxy war tracker | 3,600 | Homepage |
| who is backing ukraine | 12,100 | conflict/ukraine-russia + FAQ |
| proxy wars 2026 | 5,400 | Homepage |
| who funds houthis | 8,100 | conflict/yemen |
| us proxy wars | 4,400 | supporter/united-states |
| russia proxy wars | 3,200 | supporter/russia |
| iran proxy wars | 6,600 | supporter/iran |
| proxy war map | 2,900 | Homepage |
| who is backing [conflict country] | varies | conflict/[slug] + FAQ |
| china proxy wars 2026 | 2,200 | supporter/china |

**On-page SEO rules:**
- Homepage H1: "Proxy War Watch — Who Is Backing Whom in 2026?"
- conflict/[slug] title: "[Conflict Name] — Who Is Backing Each Side? | Proxy War Watch"
- supporter/[slug] title: "[Supporter Name] Proxy Wars 2026 | Proxy War Watch"
- FAQPage JSON-LD on FAQ page
- High-volume FAQ answers targeting "who is backing X" queries
- Internal linking: supporter pages link to all their conflicts; conflict pages link to all their supporters
- Hreflang for all 8 locales

---

## Launch Checklist

- [ ] conflicts.json populated with 15+ active proxy conflicts
- [ ] All supporter slugs referenced in conflicts.json have resolvable supporter/[slug] pages
- [ ] All conflict/[slug] pages statically generated without 404s
- [ ] All supporter/[slug] pages statically generated without 404s
- [ ] Supporter × conflict matrix rendering on homepage
- [ ] Role type badges and support level indicators displaying correctly
- [ ] Proxy depth score showing on conflict detail pages
- [ ] All 8 language translation files complete
- [ ] Ukrainian (uk) and Arabic (ar) locales verified
- [ ] Sitemap.xml includes all conflict and supporter pages
- [ ] Sitemap submitted to Google Search Console
- [ ] Google AdSense ca-pub-7098271335538021 verified and serving
- [ ] Adsterra units active
- [ ] Cookie consent banner live
- [ ] Privacy, About, FAQ pages published
- [ ] FAQ answers targeting "who is backing Ukraine/Yemen/Gaza/Sudan" queries
- [ ] OG images set for homepage, conflict, and supporter pages
- [ ] Lighthouse Performance > 85 desktop, > 80 mobile
- [ ] No console errors in production
- [ ] Vercel domain proxy-war-watch.vercel.app live and HTTPS
- [ ] Internal links between conflict ↔ supporter pages all resolve
