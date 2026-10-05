import { Link, useParams } from 'react-router-dom'
import { NavBar } from '../components/layout/NavBar'
import { WorkLayout } from '../components/work/WorkLayout'
import { work } from '../data/work'

export function WorkDetail() {
  const { slug } = useParams()
  const w = work.find(x => x.slug === slug)

  return (
    <>
      <NavBar active="" />

      {w ? (
        <WorkLayout w={w} />
      ) : (
        <section style={{ padding: 'clamp(7rem, 12vw, 10rem) clamp(1.5rem, 7vw, 6rem)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              404 · Work
            </div>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              Not found.
            </h1>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--secondary-foreground)', marginBottom: '2rem' }}>
              No write-up exists at <code style={{ fontFamily: 'JetBrains Mono,monospace', color: 'var(--accent)' }}>/work/{slug}</code>.
            </p>
            <Link to="/work" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--foreground)', padding: '0.875rem 2rem', border: '1px solid var(--border)', textDecoration: 'none', display: 'inline-block', cursor: 'none' }}>
              ← Back to Work
            </Link>
          </div>
        </section>
      )}

      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Work
        </span>
      </footer>
    </>
  )
}