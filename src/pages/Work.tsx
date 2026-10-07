import { NavBar } from '../components/layout/NavBar'
import { PageHeading } from '../components/ui/PageHeading'
import { WorkCard } from '../components/work/WorkCard'
import { work } from '../data/work'

export function Work() {
  return (
    <>
      <NavBar active="" />

      {/* ═══ WORK HERO ══════════════════════════════════════════════════ */}
      <PageHeading
        eyebrow="Work · Engineering write-ups"
        title="How I built it."
        titleAccent="And what broke."
        description="Engineering write-ups on backend projects — architecture, data models, API design, and the parts that turned out to be harder than they looked."
      />

      {/* ═══ WRITE-UPS ══════════════════════════════════════════════════ */}
      <section className="lab-cases-section">
        <div className="lab-cases-container">
          <h2 className="reveal section-heading">Write-ups</h2>

          {work.length === 0 ? (
            <div className="reveal lab-empty">
              <p>First write-up coming soon</p>
            </div>
          ) : (
            <div className="work-grid">
              {work.map((w, i) => (
                <WorkCard key={w.slug} w={w} idx={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} Prateek Saha — Work
        </span>
      </footer>
    </>
  )
}