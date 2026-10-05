import { NavBar } from '../components/layout/NavBar'
import { SectionLabel } from '../components/ui/SectionLabel'
import { WorkCard } from '../components/work/WorkCard'
import { work } from '../data/work'

export function Work() {
  return (
    <>
      <NavBar active="" />

      <section style={{ padding: 'clamp(7rem, 12vw, 10rem) clamp(1.5rem, 7vw, 6rem) clamp(3rem, 6vw, 5rem)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>Work · Engineering write-ups</SectionLabel>

          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2.25rem, 6vw, 4.5rem)', lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            How I built it.<br/>
            <span style={{ color: 'var(--accent)' }}>And what broke.</span>
          </h1>

          <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'var(--secondary-foreground)', maxWidth: '620px' }}>
            Engineering write-ups on backend projects — architecture, data models, API design, and the parts that turned out to be harder than they looked.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 7vw, 6rem) clamp(5rem, 10vw, 8rem)', background: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem', lineHeight: 1 }}>
            Write-ups
          </h2>

          {work.length === 0 ? (
            <div className="reveal" style={{ padding: '3rem 2rem', background: 'var(--card)', border: '1px dashed var(--border)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', color: 'var(--muted-foreground)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                First write-up coming soon
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '1.5rem' }}>
              {work.map((w, i) => <WorkCard key={w.slug} w={w} idx={i} />)}
            </div>
          )}
        </div>
      </section>

      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Work
        </span>
      </footer>
    </>
  )
}