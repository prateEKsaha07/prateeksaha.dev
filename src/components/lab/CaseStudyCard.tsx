import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CaseStudy } from '../../data/caseStudies'

export function CaseStudyCard({ c, idx }: { c: CaseStudy; idx: number }) {
  console.log('[CaseStudyCard] rendering', { slug: c?.slug, title: c?.title, idx })
  console.log('[CaseStudyCard] typeof title:', typeof c?.title)
  console.log('[CaseStudyCard] typeof tag:', typeof c?.tag)
  console.log('[CaseStudyCard] typeof tech:', typeof c?.tech, 'isArray:', Array.isArray(c?.tech))
  console.log('[CaseStudyCard] typeof accent:', typeof c?.accent, 'value:', c?.accent)
  console.log('[CaseStudyCard] typeof num:', typeof c?.num, 'value:', c?.num)
  console.log('[CaseStudyCard] stats:', c?.stats)

  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/lab/${c.slug}`}
      className={`reveal delay-${Math.min(idx + 1, 6)}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: hov ? 'var(--card)' : 'var(--muted)',
        border: `1px solid ${hov ? c.accent : 'var(--border)'}`,
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
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
            marginBottom: '1.25rem',
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>
          {c.num}
        </span>
        {c.metadata && (
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>
            {c.metadata.rows} · {c.metadata.features}
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: c.accent, letterSpacing: '0.15em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
        {c.tag}
      </div>

      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', lineHeight: 1.1, marginBottom: '0.875rem', letterSpacing: '-0.02em' }}>
        {c.title}
      </h3>

      <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--secondary-foreground)', marginBottom: '1.25rem' }}>
        {c.desc}
      </p>

      {c.stats && c.stats.length > 0 && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
          {c.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.25rem', color: c.accent }}>{s.val}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {c.tech.map(t => (
          <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', padding: '2px 8px', background: 'var(--secondary)', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: hov ? c.accent : 'var(--muted-foreground)', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
        Read case study →
      </div>
    </Link>
  )
}