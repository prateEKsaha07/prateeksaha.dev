import { Link } from 'react-router-dom'
import { SectionLabel } from '../ui/SectionLabel'
import type { CaseStudy } from '../../data/caseStudies'

export function CaseStudyLayout({ c }: { c: CaseStudy }) {
  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="cs-hero">
        <div className="cs-container">
          <Link to="/lab" className="cs-back">
            ← Back to Lab
          </Link>

          <div className="cs-tag" style={{ color: c.accent }}>
            {c.tag} · {c.date}
          </div>

          <h1 className="cs-title reveal">
            {c.title}
          </h1>

          <p className="cs-desc reveal delay-1">
            {c.desc}
          </p>
        </div>
      </section>

      {/* ═══ METADATA + BODY ════════════════════════════════════════════ */}
      <section className="cs-body-section">
        <div className="cs-container">
          <div className="cs-grid">
            {/* ── Metadata sidebar ── */}
            <aside className="cs-sidebar reveal">
              <div className="cs-sidebar-label">Metadata</div>

              {c.metadata && (
                <div className="cs-meta-list">
                  {[
                    ['Dataset', c.metadata.dataset],
                    ['Rows', c.metadata.rows],
                    ['Features', c.metadata.features],
                    c.metadata.target ? ['Target', c.metadata.target] : null,
                    c.metadata.missing ? ['Missing', c.metadata.missing] : null,
                  ].filter(Boolean).map(([label, val]) => (
                    <div key={label as string} className="cs-meta-row">
                      <span className="cs-meta-label">{label}</span>
                      <span className="cs-meta-value">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {c.metadata?.source && (
                <a href={c.metadata.source} target="_blank" rel="noreferrer" className="cs-link cs-link-accent">
                  Dataset source ↗
                </a>
              )}

              {c.notebook && (
                <a href={c.notebook} target="_blank" rel="noreferrer" className="cs-link cs-link-accent">
                  Notebook ↗
                </a>
              )}

              {c.github && (
                <a href={c.github} target="_blank" rel="noreferrer" className="cs-link">
                  Repo ↗
                </a>
              )}

              {c.live && (
                <a href={c.live} target="_blank" rel="noreferrer" className="cs-link">
                  Live demo ↗
                </a>
              )}

              {c.stats && c.stats.length > 0 && (
                <div className="cs-sidebar-block">
                  <div className="cs-sidebar-label">Results</div>
                  <div className="cs-stats">
                    {c.stats.map(s => (
                      <div key={s.label}>
                        <div className="cs-stat-val" style={{ color: c.accent }}>{s.val}</div>
                        <div className="cs-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="cs-sidebar-block">
                <div className="cs-sidebar-label">Stack</div>
                <div className="cs-tech-list">
                  {c.tech.map(t => (
                    <span key={t} className="cs-tech-pill">{t}</span>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── Body sections ── */}
            <div className="cs-main">
              {c.sections && c.sections.length > 0 ? (
                c.sections.map((s, i) => (
                  <div key={s.id} className={`cs-section reveal delay-${Math.min(i + 1, 4)}`}>
                    <SectionLabel>{String(i + 1).padStart(2, '0')} · {s.title}</SectionLabel>

                    <h2 className="cs-section-title">
                      {s.title}
                    </h2>

                    {s.content.split('\n\n').map((p, j) => (
                      <p key={j} className="cs-paragraph">
                        {p}
                      </p>
                    ))}

                    {s.table && (
                      <div className="cs-table-wrap">
                        <table className="cs-table">
                          <thead>
                            <tr>
                              {s.table.headers.map(h => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {s.table.rows.map((row, ri) => (
                              <tr key={ri} className={ri % 2 ? 'cs-tr-alt' : ''}>
                                {row.map((cell, ci) => (
                                  <td key={ci}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                            {s.table.note && (
                              <tr>
                                <td colSpan={s.table.headers.length} className="cs-table-note">
                                  {s.table.note}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {s.charts && s.charts.map((ch, ci) => (
                      <figure key={ci} className="cs-figure">
                        <div className="cs-chart">
                          <img src={ch.src} alt={ch.caption} />
                        </div>
                        <figcaption className="cs-caption">
                          {ch.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ))
              ) : (
                <div className="cs-placeholder reveal">
                  Full write-up coming soon
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SCOPED STYLES ══════════════════════════════════════════════ */}
      <style>{`
        /* ── Container ── */
        .cs-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
        }

        /* ── Hero ── */
        .cs-hero {
          padding: clamp(6rem, 10vw, 10rem) clamp(1.25rem, 5vw, 6rem) clamp(2.5rem, 5vw, 4rem);
          overflow: hidden;
        }

        .cs-back {
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
        .cs-back:hover {
          color: var(--accent);
        }

        .cs-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          word-break: break-word;
        }

        .cs-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 7vw, 4.5rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        .cs-desc {
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          line-height: 1.8;
          color: var(--secondary-foreground);
          max-width: 700px;
          margin: 0;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        /* ── Body section ── */
        .cs-body-section {
          padding: 0 clamp(1.25rem, 5vw, 6rem) clamp(4rem, 10vw, 8rem);
          overflow: hidden;
        }

        .cs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: start;
          min-width: 0;
        }

        /* Grid children must be able to shrink */
        .cs-grid > * {
          min-width: 0;
          max-width: 100%;
        }

        /* Desktop: sidebar + main side by side */
        @media (min-width: 900px) {
          .cs-grid {
            grid-template-columns: 280px minmax(0, 1fr);
            gap: clamp(2.5rem, 5vw, 4rem);
          }
        }

        /* ── Sidebar ── */
        .cs-sidebar {
          padding: 1.5rem;
          background: var(--muted);
          border: 1px solid var(--border);
          min-width: 0;
          max-width: 100%;
        }

        /* Mobile: sidebar below sections */
        @media (max-width: 899px) {
          .cs-sidebar {
            order: 2;
            padding: 1.25rem;
          }
          .cs-main {
            order: 1;
          }
        }

        /* Desktop: sticky sidebar */
        @media (min-width: 900px) {
          .cs-sidebar {
            position: sticky;
            top: 88px;
          }
        }

        .cs-sidebar-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .cs-sidebar-block {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border);
        }

        .cs-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .cs-meta-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          min-width: 0;
        }

        .cs-meta-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          color: var(--muted-foreground);
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .cs-meta-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          color: var(--foreground);
          text-align: right;
          word-break: break-word;
          overflow-wrap: anywhere;
          min-width: 0;
        }

        .cs-link {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          text-decoration: none;
          padding: 0.5rem 0;
          border-top: 1px solid var(--border);
          cursor: none;
          transition: color 0.2s;
          overflow-wrap: break-word;
        }
        .cs-link:hover {
          color: var(--accent);
        }
        .cs-link-accent {
          color: var(--accent);
        }

        .cs-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cs-stat-val {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          line-height: 1;
        }

        .cs-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: var(--muted-foreground);
          letter-spacing: 0.1em;
          margin-top: 0.25rem;
        }

        .cs-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .cs-tech-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          padding: 2px 8px;
          background: var(--secondary);
          color: var(--muted-foreground);
          letter-spacing: 0.05em;
        }

        /* ── Main ── */
        .cs-main {
          min-width: 0;
          max-width: 100%;
          width: 100%;
        }

        .cs-section {
          margin-bottom: 3.5rem;
          min-width: 0;
        }

        .cs-section:last-child {
          margin-bottom: 0;
        }

        .cs-section-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(1.3rem, 4vw, 2rem);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 1.25rem;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        .cs-paragraph {
          font-size: 0.9rem;
          line-height: 1.85;
          color: var(--secondary-foreground);
          margin: 0 0 1rem;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        /* ── Table ── */
        .cs-table-wrap {
          margin: 1.5rem 0;
          border: 1px solid var(--border);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }

        .cs-table {
          width: 100%;
          min-width: 460px;
          border-collapse: collapse;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
        }

        .cs-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          background: var(--card);
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.6rem;
          white-space: nowrap;
        }

        .cs-table td {
          padding: 0.65rem 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--foreground);
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .cs-tr-alt {
          background: var(--muted);
        }

        .cs-table-note {
          color: var(--muted-foreground) !important;
          font-style: italic;
          font-size: 0.65rem;
        }

        /* ── Charts ── */
        .cs-figure {
          margin: 2rem 0;
          min-width: 0;
        }

        .cs-chart {
          border: 1px solid var(--border);
          overflow: hidden;
          background: var(--muted);
          max-width: 100%;
        }

        .cs-chart img {
          width: 100%;
          height: auto;
          display: block;
          max-width: 100%;
        }

        .cs-caption {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted-foreground);
          letter-spacing: 0.05em;
          margin-top: 0.75rem;
          line-height: 1.5;
          overflow-wrap: break-word;
        }

        .cs-placeholder {
          padding: 3rem 2rem;
          background: var(--muted);
          border: 1px dashed var(--border);
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--muted-foreground);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
      `}</style>
    </>
  )
}