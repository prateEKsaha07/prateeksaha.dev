Here is the updated `README.md` file reflecting your portfolio architecture, current route structures, feature sets, project directory map, and project roadmap.

```markdown
# Portfolio — Prateek Saha

Software development and data engineering personal portfolio. Built with a brutalist-minimal dark aesthetic, high-contrast chromatic accenting, and a strict separation of content data and rendering logic.

**Live Site:** [prateeksaha-dev.vercel.app](https://prateeksaha-dev.vercel.app/)

---

## Design Stance

**Brutalist-Minimal Dark.** High-contrast chromatic accenting (`#00FF85` electric green) on a near-black ground canvas (`#090909`). Features asymmetric layouts, monospaced data indicators, geometric dividers, and a dense typographic hierarchy.

## Design Tokens & Palette

| Token | Value | Application |
| :--- | :--- | :--- |
| `--background` | `#090909` | Canvas background |
| `--foreground` | `#EEEBE6` | Primary typography |
| `--card` | `#111111` | Card containers |
| `--card-foreground` | `#EEEBE6` | Typography within cards |
| `--primary` | `#00FF85` | Accent surface (electric green) |
| `--primary-foreground` | `#090909` | Text on primary accent |
| `--secondary` | `#181818` | Secondary containers |
| `--secondary-foreground` | `#999999` | Secondary text |
| `--muted` | `#141414` | Muted containers |
| `--muted-foreground` | `#666666` | Muted typography |
| `--accent` | `#00FF85` | Primary interactive accent |
| `--accent-foreground` | `#090909` | Text on interactive accent |
| `--border` | `#1E1E1E` | Structural borders and dividers |
| `--ring` | `#00FF85` | Focus ring outline |
| `--radius` | `0px` | Corner radius (sharp geometric borders) |

## Typography Hierarchy

| Hierarchy Level | Font Family | Weight Range | Application |
| :--- | :--- | :--- | :--- |
| **Display** | **Outfit** | 700–900 | Main titles, primary headings, numerical callouts, tag labels |
| **Body** | **Inter** | 300–400 | Paragraph body text, general description copy |
| **Mono** | **JetBrains Mono** | 400–600 | Code blocks, technical metadata, chart captions, tabular data |

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build System:** Vite
- **Routing:** React Router (client-side single page application routing)
- **Styling:** Tailwind CSS v4
- **Diagramming:** Mermaid (dynamic text-rendered architecture diagrams)
- **Form Backend:** Web3Forms (contact delivery)

## Site Architecture & Routes

| Route | View Purpose | Data Module |
| :--- | :--- | :--- |
| `/` | Primary home view — hero, profile overview, skills grid, featured projects, contact | `src/data/profile.ts`, `projects.ts` |
| `/lab` | Index view for data science and machine learning case studies | `src/data/caseStudies/index.ts` |
| `/lab/:slug` | In-depth case study page (Problem framing → EDA → Features → Modeling → Evaluation) | `src/data/caseStudies/{slug}.ts` |
| `/work` | Index view for software engineering architecture write-ups | `src/data/work/index.ts` |
| `/work/:slug` | Detailed engineering write-up (System architecture, data model, APIs, retrospective) | `src/data/work/{slug}.ts` |
| `/resume` | Dedicated resume page with interactive view and PDF preview/download controls | `src/data/resume.ts` |

## Feature Set

### Home
- Interactive hero section featuring typewriter role cycling, glitch text effects, and background watermark.
- Categorized skills grid coupled with an automated marquee strip.
- Project gallery displaying custom per-project accent overrides.
- Fully functional contact form integrated with Web3Forms API.

### Lab (Data Science & ML)
- Searchable/indexed case studies with individual accent colors.
- Deep-dive analysis pages with sticky metadata sidebars.
- Custom dark-themed visualization charts with structured captions.
- Model metric comparison tables and evaluation summaries.
- Standardized six-section analytical structure.

### Work (Software Engineering)
- Architectural breakdown index.
- Deep-dive technical write-ups with horizontal key facts summary strips.
- Inline-rendered Mermaid diagrams for system architecture, data models, and ETL pipelines.
- Interactive API tables with method filter chips and click-to-copy endpoint behavior.
- Embedded markdown table, code block, and prose rendering.

### Resume
- Native dark-themed on-page resume view.
- Tabbed PDF preview engine and force-download utility.
- Quick-copy email action button.

### Global Capabilities
- Custom hardware cursor with touch-device auto-detection and `prefers-reduced-motion` support.
- Global scroll reveal system powered by a `useReveal` hook that re-initializes on route changes.
- Responsive mobile layout with dynamic navigation drawer.
- Accessible design with explicit ARIA labeling throughout.

## Directory Structure

```text
.
├── public/
│   └── Prateek_Saha_Resume.pdf
├── src/
│   ├── assets/
│   │   └── lab/                    # Case study visual assets (organized per slug)
│   ├── components/
│   │   ├── home/                   # ProjectCard, ContactForm
│   │   ├── lab/                    # CaseStudyCard, CaseStudyLayout
│   │   ├── layout/                 # NavBar
│   │   ├── ui/                     # GlitchText, SectionLabel, SkillTag
│   │   └── work/                   # ApiList, Markdown, Mermaid, WorkCard, WorkLayout
│   ├── data/
│   │   ├── profile.ts              # Bio, skills matrix, certifications
│   │   ├── projects.ts             # Homepage projects configuration
│   │   ├── resume.ts               # Structured resume data definition
│   │   ├── caseStudies/            # Lab case study content modules
│   │   │   ├── index.ts            # Type exports and case study registry
│   │   │   └── loan-approval.ts
│   │   └── work/                   # Engineering write-up content modules
│   │       ├── index.ts            # Type exports and work registry
│   │       └── marketflip.ts
│   ├── hooks/
│   │   ├── useCursor.ts
│   │   ├── useReveal.ts
│   │   ├── useTypewriter.ts
│   │   └── useActiveSection.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Lab.tsx
│   │   ├── CaseStudy.tsx
│   │   ├── Work.tsx
│   │   ├── WorkDetail.tsx
│   │   └── Resume.tsx
│   ├── App.tsx                     # Router layout and global providers
│   ├── main.tsx                    # React application entry point
│   └── index.css                   # Theme variables, custom keyframes, print rules
├── CONTENT_GUIDE.md                # Engineering guide for adding content assets
├── index.html
├── vercel.json                     # Production SPA routing rules
├── vite.config.ts
├── tsconfig.json
└── package.json

```

## Content Management

Refer to [`CONTENT_GUIDE.md`](https://www.google.com/search?q=./CONTENT_GUIDE.md) for full documentation on content updates and data contracts.

* **Adding a Case Study:** Create `src/data/caseStudies/{slug}.ts`, register in `src/data/caseStudies/index.ts`, and place PNG charts in `src/assets/lab/{slug}/`.
* **Adding an Engineering Write-Up:** Create `src/data/work/{slug}.ts` and register in `src/data/work/index.ts`.
* **Adding a Project:** Append an object entry to `src/data/projects.ts`.
* **Adding Skills:** Update the categorical skills object within `src/data/profile.ts`.

## Local Development

Ensure **Node.js (v18+)** and **pnpm** are installed.

```bash
# Install dependencies
pnpm install

# Start local development server (http://localhost:5173)
pnpm dev

# Build production bundle (outputs to dist/)
pnpm build

# Locally preview production build
pnpm preview

```

## Deployment

Automated CI/CD deployments are hosted on **Vercel** via GitHub integration. Pushes to the `main` branch trigger production builds.

The included `vercel.json` file configures SPA rewrite rules to ensure client-side routes (`/lab/:slug`, `/work/:slug`, `/resume`) resolve correctly on direct hard reloads.

---

## Technical Roadmap

### Completed Features

* [x] Homepage layout — hero, bio, skills matrix, projects showcase, contact section.
* [x] Lab section — initial tabular classification case study (Loan Approval).
* [x] Work section — initial full-stack architecture write-up (MarketFlip).
* [x] Resume view — on-page layout, native PDF preview tab, direct download link, copy-to-clipboard email trigger.
* [x] Routing navbar — active route detection, route changes, mobile drawer menu.
* [x] Mermaid diagram integration for technical architecture rendering.
* [x] Interactive API tables with method filtering and copy-on-click endpoints.
* [x] Markdown table rendering support.
* [x] Dedicated print styles for the resume page layout.
* [x] Viewport responsiveness validation across mobile and desktop breakpoints.
* [x] Project maintenance guide (`CONTENT_GUIDE.md`).

### In Progress

* [ ] Second engineering write-up — AI Study Companion (RAG architecture & pipeline details).
* [ ] Second ML case study — SENTINEL.v8 (Computer Vision target evaluation).
* [ ] Technical notes route (`/notes`) for short analytical articles (400–800 words).
* [ ] `/now` page tracking current project focus, reading lists, and tech stack explorations.

### Planned

* [ ] Filterable tags for the `/work` index route.
* [ ] Third engineering write-up — AdventureWorks BI (SQL data modeling & analytics).
* [ ] Finished project postmortem reports.
* [ ] Custom dark-themed 404 route.
* [ ] Curated developer reading list.
* [ ] Development environment summary page (`/stack`).

### Out of Scope (Explicit Non-Goals)

* Light theme mode — design system is dark-only by specification.
* Embedded AI chat widgets — avoided to maintain minimal bundle overhead and performance.
* Unverified testimonial blocks.
* 3D hero graphics (e.g., Three.js) — omitted to prioritize page load speeds and accessibility.
* Live GitHub statistics widgets.

---

## Contact & Links

* **Email:** prateeksaha963@gmail.com
* **GitHub:** [@prateEKsaha07](https://github.com/prateEKsaha07)
* **LinkedIn:** [prateeksaha](https://www.linkedin.com/in/prateeksaha)

```

```