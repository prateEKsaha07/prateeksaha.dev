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
- **Package Manager:** npm

## Site Architecture & Routes

| Route | View Purpose | Data Module |
| :--- | :--- | :--- |
| `/` | Primary home view — hero, profile overview, skills grid, featured projects, contact | `src/data/profile.ts`, `projects.ts` |
| `/lab` | Index view for data science and machine learning case studies | `src/data/caseStudies/index.ts` |
| `/lab/:slug` | In-depth case study page (Problem framing → EDA → Features → Modeling → Evaluation) | `src/data/caseStudies/{slug}.ts` |
| `/work` | Index view for software engineering architecture write-ups | `src/data/work/index.ts` |
| `/work/:slug` | Detailed engineering write-up (System architecture, data model, APIs, retrospective) | `src/data/work/{slug}.ts` |
| `/resume` | Dedicated resume page with interactive view and PDF preview/download controls | `src/data/resume.ts` |

## Content Inventory

### Case Studies (`/lab`)

| Slug | Project | Domain |
| :--- | :--- | :--- |
| `loan-approval` | Loan Approval Prediction | Tabular classification |
| `sentinel-v8` | SENTINEL.v8 — Vehicle Detection | Computer vision / object detection |
| `adventureworks-bi` | AdventureWorks — Sales Analysis | SQL + Power BI analytics |

### Engineering Write-Ups (`/work`)

| Slug | Project | Domain |
| :--- | :--- | :--- |
| `marketflip` | MarketFlip | Full-stack marketplace |
| `geargrid` | GearGrid | Peer-to-peer farm equipment rental |
| `rag-v2` | AI Study Companion | Retrieval-augmented generation |

## Feature Set

### Home
- Interactive hero section featuring typewriter role cycling, glitch text effects, and background watermark.
- Categorized skills grid coupled with an automated marquee strip.
- Project gallery displaying custom per-project accent overrides.
- Fully functional contact form integrated with Web3Forms API.

### Lab (Data Science & ML)
- Index of case studies with per-study accent colors.
- Deep-dive pages with sticky metadata sidebar (position-holds on desktop, flows below on mobile).
- Dark-themed charts rendered full-width with captions.
- Comparison tables, evaluation metrics, and six-section analytical structure.
- Markdown rendering with bold, inline code, bullet lists, tables, and code blocks.

### Work (Software Engineering)
- Index of architectural write-ups.
- Deep-dive pages with horizontal facts strip (distinct layout from case studies).
- Inline-rendered Mermaid diagrams for architecture, data models, and pipelines.
- Interactive API tables with method filter chips and click-to-copy endpoint behavior.
- Markdown rendering for prose, code, and tables.

### Resume
- Native dark-themed on-page resume view.
- PDF preview (opens in new tab) and force-download controls.
- Copy-to-clipboard email action.

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
│   │   │   ├── loan-approval.ts
│   │   │   ├── sentinel-v8.ts
│   │   │   └── adventureworks-bi.ts
│   │   └── work/                   # Engineering write-up content modules
│   │       ├── index.ts            # Type exports and work registry
│   │       ├── marketflip.ts
│   │       ├── geargrid.ts
│   │       └── rag-v2.ts
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