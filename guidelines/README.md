# Portfolio — Prateek Saha

A personal portfolio site for a software developer, data engineer, and AI builder. Dark, brutalist-minimal aesthetic with a single high-contrast accent color.

**Live:** [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

## Design Stance

**Brutalist-Minimal Dark.** One saturated-chromatic accent (`#00FF85` electric green) on a near-black ground (`#090909`). Split-canvas asymmetric layouts, monospaced counters, sharp geometric dividers, and dense typographic hierarchy.

## Palette

| Token | Value | Use |
|---|---|---|
| `--background` | `#090909` | Page background |
| `--foreground` | `#EEEBE6` | Primary text |
| `--card` | `#111111` | Card surfaces |
| `--card-foreground` | `#EEEBE6` | Card text |
| `--primary` | `#00FF85` | Accent (electric green) |
| `--primary-foreground` | `#090909` | Text on accent |
| `--secondary` | `#181818` | Secondary surfaces |
| `--secondary-foreground` | `#999999` | Secondary text |
| `--muted` | `#141414` | Muted surfaces |
| `--muted-foreground` | `#666666` | Muted text |
| `--accent` | `#00FF85` | Interactive accent |
| `--accent-foreground` | `#090909` | Text on accent |
| `--border` | `#1E1E1E` | Dividers |
| `--ring` | `#00FF85` | Focus ring |
| `--radius` | `0px` | Sharp corners |

## Typography

| Role | Font | Weight |
|---|---|---|
| Display | **Outfit** | 700–900 |
| Body | **Inter** | 300–400 |
| Mono | **JetBrains Mono** | 400–600 |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — utility styling
- **Web3Forms** — contact form backend

## Features

- Hero with typewriter role cycling + glitch text
- Skills marquee + categorized skill grid
- Project gallery with per-project accent colors
- Working contact form (delivers to inbox via Web3Forms)
- Custom cursor (respects `prefers-reduced-motion`, hidden on touch devices)
- Fully responsive — mobile hamburger nav
- Accessibility: `aria-label`s, bypass link, reduced-motion support

## Project Structure

```
.
├── .figma/make/          # Figma Make config (site.json drives <head>)
├── public/               # Static assets
├── src/
│   ├── App.tsx           # Main app (all components inline)
│   ├── main.tsx          # Entry point
│   └── index.css         # Theme + animations
├── index.html            # HTML shell
├── vite.config.ts        # Build config
├── tsconfig.json         # TypeScript config
├── package.json
└── pnpm-lock.yaml
```

## Local Development

Requires **Node 18+** and **pnpm**.

```bash
pnpm install       # install dependencies
pnpm dev           # start dev server (http://localhost:5173)
pnpm build         # production build → dist/
pnpm preview       # preview production build locally
```

## Deployment

Deployed on **Vercel** via GitHub. Every push to `main` triggers an auto-deploy.

## Contact

- **Email:** prateeksaha963@gmail.com
- **GitHub:** [@prateEKsaha07](https://github.com/prateEKsaha07)
- **LinkedIn:** [prateeksaha](https://www.linkedin.com/in/prateeksaha)