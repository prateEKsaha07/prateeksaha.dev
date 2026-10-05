import { NavBar } from '../components/layout/NavBar'
import { SectionLabel } from '../components/ui/SectionLabel'
import { ProjectCard } from '../components/home/ProjectCard'
import { CaseStudyCard } from '../components/lab/CaseStudyCard'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'

export function Lab() {
  return (
    <>
      <NavBar active="" />

      {/* ═══ LAB HERO ═══════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(7rem, 12vw, 10rem) clamp(1.5rem, 7vw, 6rem) clamp(3rem, 6vw, 5rem)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Lab · Case Studies</SectionLabel>

          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Datasets I've<br/>
            <span style={{ color: 'var(--accent)' }}>torn apart.</span>
          </h1>

          <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'var(--secondary-foreground)', maxWidth: '620px', marginBottom: '2.5rem' }}>
            Case studies on real datasets — problem framing, EDA, feature engineering, modeling, evaluation. Notebooks, repos, and honest notes on what worked and what didn't.
          </p>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Case studies', val: String(caseStudies.length) },
              { label: 'Models explored', val: '10+' },
              { label: 'Domains', val: 'CV · NLP · Tabular' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {s.val}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDIES ═══════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 7vw, 6rem) clamp(5rem, 10vw, 8rem)', background: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', lineHeight: 1 }}>
            Case studies
          </h2>

          {caseStudies.length === 0 ? (
            <div
              className="reveal"
              style={{
                padding: '3rem 2rem',
                background: 'var(--card)',
                border: '1px dashed var(--border)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', color: 'var(--muted-foreground)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                First case study coming soon
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' }}>
              {caseStudies.map((c, i) => <CaseStudyCard key={c.slug} c={c} idx={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ═══ FULLSTACK BRANCH ═══════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 7vw, 6rem)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Supporting Work</SectionLabel>

          <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1 }}>
            Other things I build.
          </h2>

          <p className="reveal" style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--secondary-foreground)', marginBottom: '2.5rem', maxWidth: '520px' }}>
            Backend systems and web apps that support the data work above.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1.25rem' }}>
            {projects.map((p, i) => <ProjectCard key={p.title} p={p} idx={i} />)}
          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Lab
        </span>
      </footer>
    </>
  )
}