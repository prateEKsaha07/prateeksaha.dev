import { NavBar } from '../components/layout/NavBar'
import { PageHeading } from '../components/ui/PageHeading'
import { CaseStudyCard } from '../components/lab/CaseStudyCard'
import { caseStudies } from '../data/caseStudies'

export function Lab() {
  return (
    <>
      <NavBar active="" />

      <PageHeading
        eyebrow="Lab · Case Studies"
        title="Datasets I've"
        titleAccent="torn apart."
        description="Case studies on real datasets — problem framing, EDA, feature engineering, modeling, evaluation. Notebooks, repos, and honest notes on what worked and what didn't."
      />

      <section className="lab-cases-section">
        <div className="lab-cases-container">
          <h2 className="reveal section-heading">Case studies</h2>

          {caseStudies.length === 0 ? (
            <div className="reveal lab-empty">
              <p>First case study coming soon</p>
            </div>
          ) : (
            <div className="reveal lab-cases-grid">
              {caseStudies.map(c => (
                <CaseStudyCard key={c.slug} c={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} Prateek Saha — Lab
        </span>
      </footer>
    </>
  )
}