import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CaseStudy } from '../../data/caseStudies'

export function CaseStudyCard({ c, idx }: { c: CaseStudy; idx: number }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/lab/${c.slug}`}
      className={`reveal delay-${Math.min(idx + 1, 6)}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        background: hov ? 'var(--card)' : 'var(--muted)',
        border: `1px solid ${hov ? c.accent : 'var(--border)'}`,
        padding: 'clamp(1.25rem, 2.5vw, 1.5rem)', // Reduced padding for compactness
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%', // Ensures cards stretch to fill grid cells
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, right: 0,
          width: hov ? '80px' : '0', height: '3px',
          background: c.accent,
          transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {c.thumbnail && (
        <div
          style={{
            marginBottom: '1rem', // Reduced from 1.25rem
            border: '1px solid var(--border)',
            overflow: 'hidden',
            background: 'var(--background)',
          }}
        >
          <img
            src={c.thumbnail}
            alt={c.title}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Top Meta Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>
          {c.num}
        </span>
        {c.metadata && (
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em', textAlign: 'right' }}>
            {c.metadata.rows} · {c.metadata.features}
          </span>
        )}
      </div>

      {/* Tag */}
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: c.accent, letterSpacing: '0.15em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
        {c.tag}
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)', lineHeight: 1.1, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        {c.title}
      </h3>

      {/* Description - flexGrow pushes the rest of the content down for uniformity */}
      <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--secondary-foreground)', marginBottom: '1rem', flexGrow: 1 }}>
        {c.desc}
      </p>

      {/* Stats */}
      {c.stats && c.stats.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          {c.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.15rem', color: c.accent }}>{s.val}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tech Tags - Compacted */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
        {c.tech.map(t => (
          <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.55rem', padding: '2px 6px', background: 'var(--secondary)', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: hov ? c.accent : 'var(--muted-foreground)', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s', marginTop: 'auto' }}>
        Read case study →
      </div>
    </Link>
  )
}