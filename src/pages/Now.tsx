import { NavBar } from '../components/layout/NavBar'
import { PageHeading } from '../components/ui/PageHeading'
import { now } from '../data/now'

export function Now() {
  return (
    <>
      <NavBar active="" />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <PageHeading
        eyebrow={`Now · ${now.lastUpdated}`}
        title="What I'm doing"
        titleAccent="right now."
        description="A snapshot of current work, learning, and reading. Updated monthly — the timestamp above is the source of truth."
      />

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

      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} Prateek Saha — Now
        </span>
      </footer>
    </>
  )
}