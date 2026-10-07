import { NavBar } from '../components/layout/NavBar'
import { SectionLabel } from '../components/ui/SectionLabel'
import { now } from '../data/now'

export function Now() {
  return (
    <>
      <NavBar active="" />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="now-hero">
        <div className="now-container">
          <SectionLabel>Now · {now.lastUpdated}</SectionLabel>

          <h1 className="now-title">
            What I'm doing<br/>
            <span style={{ color: 'var(--accent)' }}>right now.</span>
          </h1>

          <p className="now-desc">
            A snapshot of current work, learning, and reading. Updated monthly — the timestamp above is the source of truth.
          </p>
        </div>
      </section>

      {/* ═══ BODY ═══════════════════════════════════════════════════════ */}
      <section className="now-body-section">
        <div className="now-container">
          <div className="now-columns">

            {/* ── Building ── */}
            <div className="now-column reveal">
              <div className="now-column-head">
                <span className="now-column-num">01</span>
                <span className="now-column-label">Building</span>
              </div>

              <div className="now-list">
                {now.building.map(item => (
                  <div key={item.title} className="now-item">
                    <div className="now-item-title">{item.title}</div>
                    <div className="now-item-status">{item.status}</div>
                    <p className="now-item-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Learning ── */}
            <div className="now-column reveal delay-1">
              <div className="now-column-head">
                <span className="now-column-num">02</span>
                <span className="now-column-label">Learning</span>
              </div>

              <div className="now-list">
                {now.learning.map(item => (
                  <div key={item.topic} className="now-item">
                    <div className="now-item-title">{item.topic}</div>
                    <div className="now-item-status">{item.source}</div>
                    <p className="now-item-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reading ── */}
            <div className="now-column reveal delay-2">
              <div className="now-column-head">
                <span className="now-column-num">03</span>
                <span className="now-column-label">Reading</span>
              </div>

              <div className="now-list">
                {now.reading.map(item => (
                  <div key={item.title} className="now-item">
                    <div className="now-item-title">{item.title}</div>
                    <div className="now-item-status">{item.author}</div>
                    <p className="now-item-desc">{item.takeaway}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Now
        </span>
      </footer>

      {/* ═══ SCOPED STYLES ══════════════════════════════════════════════ */}
      <style>{`
        .now-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
        }

        /* ── Hero ── */
        .now-hero {
          padding: clamp(7rem, 12vw, 10rem) clamp(1.25rem, 5vw, 6rem) clamp(2.5rem, 5vw, 4rem);
        }

        .now-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.25rem, 7vw, 4.5rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem;
          overflow-wrap: break-word;
        }

        .now-desc {
          font-size: clamp(0.9rem, 1.5vw, 1rem);
          line-height: 1.8;
          color: var(--secondary-foreground);
          max-width: 620px;
          margin: 0;
          overflow-wrap: break-word;
        }

        /* ── Body ── */
        .now-body-section {
          padding: 0 clamp(1.25rem, 5vw, 6rem) clamp(4rem, 8vw, 6rem);
        }

        .now-columns {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          min-width: 0;
        }

        @media (min-width: 900px) {
          .now-columns {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(1.5rem, 3vw, 3rem);
          }
        }

        .now-column {
          min-width: 0;
          max-width: 100%;
        }

        .now-column-head {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }

        .now-column-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--accent);
        }

        .now-column-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }

        .now-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .now-item {
          min-width: 0;
        }

        .now-item-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.01em;
          color: var(--foreground);
          margin-bottom: 0.25rem;
          overflow-wrap: break-word;
        }

        .now-item-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-bottom: 0.5rem;
          overflow-wrap: break-word;
        }

        .now-item-desc {
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--secondary-foreground);
          margin: 0;
          overflow-wrap: break-word;
        }
      `}</style>
    </>
  )
}