import { Link } from 'react-router-dom'
import { Markdown } from './Markdown'
import { ApiList, type ApiGroup } from './ApiList'
import type { Work } from '../../data/work'

// API endpoint data — separate from markdown so it can render as a component
const marketflipApiGroups: ApiGroup[] = [
  {
    title: 'Auth',
    endpoints: [
      { method: 'POST',  path: '/auth/signup',              description: 'Create a Supabase Auth account and its corresponding profile row.' },
      { method: 'POST',  path: '/auth/login',               description: 'Sign in and return the Supabase access token and role.' },
      { method: 'GET',   path: '/auth/profiles/{id}',       description: 'Fetch a profile by user ID.' },
      { method: 'PATCH', path: '/auth/profiles/{id}',       description: 'Update a profile. Only the owner can modify their own profile.' },
    ],
  },
  {
    title: 'Requests',
    note: 'Buyer-driven marketplace',
    endpoints: [
      { method: 'POST', path: '/requests',              description: 'Create a purchase request. Fields: item_name, budget_min, budget_max, pincode, category_id, image_urls.' },
      { method: 'GET',  path: '/requests',              description: 'Browse and filter open requests. Supports category and pincode filters.' },
      { method: 'GET',  path: '/requests/{id}',         description: 'View a request and, for the buyer, its bids.' },
      { method: 'POST', path: '/requests/{id}/bids',    description: 'Submit a shop offer on a request. Body: price, note.' },
    ],
  },
  {
    title: 'Bids',
    endpoints: [
      { method: 'GET',   path: '/bids',                 description: 'List bids placed by the current shop owner.' },
      { method: 'GET',   path: '/bids/{id}',            description: 'Fetch a single bid with its request context.' },
      { method: 'PATCH', path: '/bids/{id}/select',     description: 'Buyer selects a winning bid. Rejects sibling bids and unlocks the conversation.' },
    ],
  },
  {
    title: 'Auctions',
    note: 'Shop-driven marketplace',
    endpoints: [
      { method: 'POST', path: '/auctions',              description: 'Create an auction. Fields: item_name, starting_price, reserve_price, end_time.' },
      { method: 'GET',  path: '/auctions',              description: 'Browse active auctions. Supports status and category filters.' },
      { method: 'GET',  path: '/auctions/{id}',         description: 'View an auction and its bid history.' },
      { method: 'POST', path: '/auctions/{id}/bids',    description: 'Place a bid on an auction. Enforces current_highest_bid > previous.' },
    ],
  },
  {
    title: 'Chat',
    endpoints: [
      { method: 'GET',   path: '/chat/conversations',                     description: 'List the current user\'s conversations.' },
      { method: 'GET',   path: '/chat/conversations/{id}/messages',       description: 'Fetch message history. Reverse-chronological, paginated.' },
      { method: 'POST',  path: '/chat/conversations/{id}/messages',       description: 'Send a message. Rate limited to 1 per 2 seconds per user.' },
      { method: 'PATCH', path: '/chat/conversations/{id}/read',           description: 'Mark all messages in a conversation as read.' },
    ],
  },
  {
    title: 'AI Assistant',
    note: 'Buyer-side, shipped',
    endpoints: [
      { method: 'POST',  path: '/ai/parse-request',              description: 'Natural language → structured request draft via Gemini. Returns draft, missing_fields, low_confidence_fields.' },
      { method: 'PATCH', path: '/ai/parse-request/{log_id}',     description: 'Record the buyer\'s accept or edit choice against a parse log.' },
      { method: 'GET',   path: '/ai/categories',                 description: 'Fetch the live category list — used as prompt context during parsing.' },
      { method: 'POST',  path: '/ai/ask',                        description: 'Answer a data question about the buyer\'s own requests and bids.' },
    ],
  },
  {
    title: 'ML',
    endpoints: [
      { method: 'POST', path: '/ml/price-suggestion', description: 'Suggest a price for a new request based on budget range and category.' },
      { method: 'POST', path: '/ml/rank-bids',        description: 'Rank a set of bids by price (60%) and shop reliability (40%).' },
      { method: 'GET',  path: '/ml/recommendations',  description: 'Suggest related categories based on transaction co-occurrence.' },
      { method: 'GET',  path: '/ml/demand-forecast',  description: 'Return a 7-day demand forecast per category.' },
      { method: 'POST', path: '/ml/detect-fraud',     description: 'Score a bid for fraud risk and return contributing factors.' },
    ],
  },
]

export function WorkLayout({ w }: { w: Work }) {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="wk-hero">
        <div className="wk-container">
          <Link to="/work" className="wk-back">← Back to Work</Link>

          <div className="wk-meta-row">
            <span className="wk-meta-tag">{w.tag}</span>
            <span className="wk-meta-sep">/</span>
            <span className="wk-meta-date">{w.date}</span>
          </div>

          <h1 className="wk-title reveal">{w.title}</h1>

          <p className="wk-summary reveal delay-1">{w.summary}</p>

          <div className="wk-links reveal delay-2">
            {w.live && (
              <a href={w.live} target="_blank" rel="noreferrer" className="wk-link wk-link-primary">
                Live site <span className="wk-arrow">↗</span>
              </a>
            )}
            {w.github && (
              <a href={w.github} target="_blank" rel="noreferrer" className="wk-link">
                Repository <span className="wk-arrow">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FACTS STRIP ═══ */}
      <section className="wk-facts-strip">
        <div className="wk-container">
          <div className="wk-facts-row reveal">
            <Fact label="Stack" values={w.facts.stack} />
            <Fact label="Database" values={[w.facts.database]} />
            <Fact label="Auth" values={[w.facts.auth]} />
            <Fact label="Realtime" values={[w.facts.realtime]} />
            <Fact label="Hosting" values={[w.facts.hosting]} />
            <Fact label="Status" values={[w.facts.status]} />
          </div>
        </div>
      </section>

      {/* ═══ BODY ═══ */}
      <section className="wk-body-section">
        <div className="wk-container">
          <div className="wk-main">
            {w.sections.map((s, i) => (
              <article key={s.id} className={`wk-section reveal delay-${Math.min(i + 1, 4)}`}>
                <header className="wk-section-header">
                  <span className="wk-section-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="wk-section-slash">/</span>
                  <span className="wk-section-label">{s.title}</span>
                  <span className="wk-section-line" />
                </header>

                <h2 className="wk-section-title">{s.title}</h2>

                <div className="wk-section-body">
                  {s.id === 'api'
                    ? <ApiList groups={marketflipApiGroups} />
                    : <Markdown content={s.content} />
                  }
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER NAV ═══ */}
      <section className="wk-footer-nav">
        <div className="wk-container">
          <Link to="/work" className="wk-footer-back">
            ← All write-ups
          </Link>
        </div>
      </section>

      {/* ═══ STYLES ═══ */}
      <style>{`
        .wk-container {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
        }

        .wk-hero {
          padding: clamp(7rem, 12vw, 10rem) clamp(1.25rem, 5vw, 3rem) clamp(2.5rem, 5vw, 3.5rem);
          overflow: hidden;
        }

        .wk-back {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          text-decoration: none;
          display: inline-block;
          margin-bottom: 2rem;
          transition: color 0.2s;
          cursor: none;
        }
        .wk-back:hover { color: var(--accent); }

        .wk-meta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .wk-meta-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .wk-meta-sep {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--border);
        }
        .wk-meta-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--muted-foreground);
        }

        .wk-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.25rem, 7vw, 4.5rem);
          line-height: 1.02;
          letter-spacing: -0.04em;
          margin: 0 0 1.5rem;
          overflow-wrap: break-word;
        }

        .wk-summary {
          font-size: clamp(0.95rem, 1.6vw, 1.1rem);
          line-height: 1.75;
          color: var(--secondary-foreground);
          max-width: 720px;
          margin: 0 0 2rem;
          overflow-wrap: break-word;
        }

        .wk-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .wk-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.75rem 1.4rem;
          text-decoration: none;
          cursor: none;
          transition: all 0.2s;
          border: 1px solid var(--border);
          color: var(--foreground);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .wk-link:hover { border-color: var(--accent); color: var(--accent); }
        .wk-link-primary {
          background: var(--accent);
          color: var(--accent-foreground);
          border-color: var(--accent);
        }
        .wk-link-primary:hover { background: transparent; color: var(--accent); }
        .wk-arrow { font-size: 0.85em; opacity: 0.8; }

        .wk-facts-strip {
          padding: 0 clamp(1.25rem, 5vw, 3rem) clamp(2rem, 4vw, 3rem);
          border-bottom: 1px solid var(--border);
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
          overflow: hidden;
        }
        .wk-facts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
          gap: 1.25rem 1.5rem;
          padding-bottom: clamp(2rem, 4vw, 3rem);
          border-bottom: 1px solid var(--border);
        }

        .wk-body-section {
          padding: 0 clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem);
          overflow: hidden;
        }
        .wk-main { min-width: 0; max-width: 100%; width: 100%; }

        .wk-section { margin-bottom: 3.5rem; min-width: 0; }
        .wk-section:last-child { margin-bottom: 0; }

        .wk-section-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }
        .wk-section-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--accent);
        }
        .wk-section-slash {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--border);
        }
        .wk-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }
        .wk-section-line {
          flex: 1;
          height: 1px;
          background: var(--border);
          margin-left: 0.75rem;
        }
        .wk-section-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0 0 1.5rem;
          overflow-wrap: break-word;
        }
        .wk-section-body { min-width: 0; }

        .work-mermaid {
          margin: 2rem 0;
          padding: 1.75rem 1rem;
          background: var(--muted);
          border: 1px solid var(--border);
          position: relative;
          overflow-x: auto;
          display: flex;
          justify-content: center;
          min-height: 100px;
        }
        .work-mermaid::before {
          content: 'diagram';
          position: absolute;
          top: -0.5rem;
          left: 0.85rem;
          background: var(--background);
          padding: 0 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }
        .work-mermaid svg { max-width: 100%; height: auto; }

        .wk-footer-nav {
          padding: 2.5rem clamp(1.25rem, 5vw, 3rem) 4rem;
          border-top: 1px solid var(--border);
          overflow: hidden;
        }
        .wk-footer-back {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          text-decoration: none;
          transition: color 0.2s;
          cursor: none;
        }
        .wk-footer-back:hover { color: var(--accent); }

        .wk-fact-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: var(--accent);
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.5rem;
        }
        .wk-fact-values { display: flex; flex-direction: column; gap: 0.2rem; }
        .wk-fact-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--foreground);
          line-height: 1.45;
          word-break: break-word;
        }

        /* ── ApiList ── */
        .apilist {
          border: 1px solid var(--border);
          background: var(--card);
          margin: 1.5rem 0;
        }
        .apilist-group { border-bottom: 1px solid var(--border); }
        .apilist-group:last-child { border-bottom: none; }

        .apilist-group-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          padding: 0.85rem 1rem 0.35rem;
        }
        .apilist-group-note {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--muted-foreground);
          padding: 0 1rem 0.5rem;
        }
        .apilist-rows { display: flex; flex-direction: column; }
      `}</style>
    </>
  )
}

function Fact({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <span className="wk-fact-label">{label}</span>
      <div className="wk-fact-values">
        {values.map((v, i) => (
          <span key={i} className="wk-fact-value">{v}</span>
        ))}
      </div>
    </div>
  )
}