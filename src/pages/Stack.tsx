import { NavBar } from '../components/layout/NavBar'
import { SectionLabel } from '../components/ui/SectionLabel'
import { stack, essentials } from '../data/stack'

export function Stack() {
  const totalTools = stack.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <>
      <NavBar active="" />

      {/* ═══ HERO ═══ */}
      <section className="stack-hero">
        <div className="stack-container">
          <SectionLabel>Stack · Dev Environment</SectionLabel>

          <h1 className="stack-title">
            What I work<br/>
            <span style={{ color: 'var(--accent)' }}>with.</span>
          </h1>

          <p className="stack-desc">
    Every tool, language, and framework I've used at least once or twice across projects, coursework, and internships — grouped by where it sits in the workflow. Not a claim of mastery. A record of exposure.
  </p>

          <div className="stack-stats">
            <div className="stack-stat">
              <div className="stack-stat-val">{stack.length}</div>
              <div className="stack-stat-label">Categories</div>
            </div>
            <div className="stack-stat">
              <div className="stack-stat-val">{totalTools}</div>
              <div className="stack-stat-label">Tools listed</div>
            </div>
            <div className="stack-stat">
              <div className="stack-stat-val">2</div>
              <div className="stack-stat-label">Hosting providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ESSENTIALS ═══ */}
      <section className="stack-essentials-section">
        <div className="stack-container">
          <div className="stack-essentials reveal">
            <div className="stack-essentials-head">
              <span className="stack-essentials-label">The essentials</span>
              <span className="stack-essentials-note">if you only read six lines</span>
            </div>

            <div className="stack-essentials-grid">
              {essentials.map(e => (
                <div key={e.name} className="stack-essential">
                  <div className="stack-essential-name">{e.name}</div>
                  <div className="stack-essential-detail">{e.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GROUPS ═══ */}
      <section className="stack-body-section">
        <div className="stack-container">
          <div className="stack-groups">
            {stack.map((group, gi) => (
              <div key={group.label} className={`stack-group reveal delay-${Math.min(gi + 1, 6)}`}>
                <div className="stack-group-head">
                  <span className="stack-group-num">{String(gi + 1).padStart(2, '0')}</span>
                  <span className="stack-group-label">{group.label}</span>
                  <span className="stack-group-line" />
                  <span className="stack-group-count">{group.items.length}</span>
                </div>

                <div className="stack-items">
                  {group.items.map(item => (
                    <div key={item.name} className="stack-item">
                      <div className="stack-item-name">
                        <span className="stack-item-bullet">→</span>
                        {item.name}
                      </div>
                      <div className="stack-item-detail">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem clamp(1.25rem, 5vw, 3rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Stack
        </span>
      </footer>

      {/* ═══ STYLES ═══ */}
      <style>{`
        .stack-container {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
        }

        .stack-hero {
          padding: clamp(7rem, 12vw, 10rem) clamp(1.25rem, 5vw, 3rem) clamp(2.5rem, 5vw, 3.5rem);
        }

        .stack-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.25rem, 7vw, 4.5rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem;
          overflow-wrap: break-word;
        }

        .stack-desc {
          font-size: clamp(0.9rem, 1.5vw, 1rem);
          line-height: 1.8;
          color: var(--secondary-foreground);
          max-width: 620px;
          margin: 0 0 3rem;
          overflow-wrap: break-word;
        }

        .stack-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 0;
        }

        .stack-stat {
          padding: 0 1rem;
          border-right: 1px solid var(--border);
        }
        .stack-stat:last-child {
          border-right: none;
        }
        .stack-stat:first-child {
          padding-left: 0;
        }

        .stack-stat-val {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          line-height: 1;
          color: var(--accent);
          letter-spacing: -0.02em;
        }

        .stack-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          margin-top: 0.5rem;
        }

        .stack-essentials-section {
          padding: 0 clamp(1.25rem, 5vw, 3rem) clamp(3rem, 6vw, 4rem);
        }

        .stack-essentials {
          border: 1px solid var(--border);
          background: var(--card);
          padding: clamp(1.5rem, 3vw, 2rem);
          position: relative;
        }

        .stack-essentials::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: var(--accent);
        }

        .stack-essentials-head {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .stack-essentials-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .stack-essentials-note {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--muted-foreground);
        }

        .stack-essentials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
          gap: 1.25rem 1.5rem;
        }

        .stack-essential {
          min-width: 0;
        }

        .stack-essential-name {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--foreground);
          margin-bottom: 0.25rem;
          letter-spacing: -0.01em;
          overflow-wrap: break-word;
        }

        .stack-essential-detail {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: var(--muted-foreground);
          overflow-wrap: break-word;
        }

        .stack-body-section {
          padding: 0 clamp(1.25rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem);
        }

        .stack-groups {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          min-width: 0;
        }

        .stack-group {
          min-width: 0;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--border);
        }
        .stack-group:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .stack-group-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          min-width: 0;
        }

        .stack-group-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          color: var(--accent);
          flex-shrink: 0;
        }

        .stack-group-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--foreground);
          flex-shrink: 0;
        }

        .stack-group-line {
          flex: 1;
          height: 1px;
          background: var(--border);
          margin: 0 0.5rem;
          min-width: 1rem;
        }

        .stack-group-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          color: var(--muted-foreground);
          flex-shrink: 0;
        }

        .stack-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }

        .stack-item {
          min-width: 0;
          padding-left: 0.75rem;
          border-left: 2px solid var(--border);
          transition: border-color 0.2s;
        }

        .stack-item:hover {
          border-left-color: var(--accent);
        }

        @media (min-width: 700px) {
          .stack-items {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem 2rem;
          }
        }

        .stack-item-name {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
          color: var(--foreground);
          margin-bottom: 0.3rem;
          overflow-wrap: break-word;
        }

        .stack-item-bullet {
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 400;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .stack-item-detail {
          font-size: 0.78rem;
          line-height: 1.6;
          color: var(--secondary-foreground);
          overflow-wrap: break-word;
          padding-left: 1rem;
        }
      `}</style>
    </>
  )
}