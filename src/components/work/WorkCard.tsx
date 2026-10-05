import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Work } from '../../data/work'

export function WorkCard({ w, idx }: { w: Work; idx: number }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/work/${w.slug}`}
      className={`reveal delay-${Math.min(idx + 1, 6)}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: hov ? 'var(--card)' : 'var(--muted)',
        border: `1px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: hov ? '80px' : '0', height: '3px',
        background: 'var(--accent)',
        transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>
          {w.date}
        </span>
        {w.live && (
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>
            LIVE ↗
          </span>
        )}
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
        {w.tag}
      </div>

      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', lineHeight: 1.1, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        {w.title}
      </h3>

      <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--secondary-foreground)', marginBottom: '1.25rem' }}>
        {w.summary}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {w.facts.stack.slice(0, 4).map(t => (
          <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', padding: '2px 8px', background: 'var(--secondary)', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: hov ? 'var(--accent)' : 'var(--muted-foreground)', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
        Read write-up →
      </div>
    </Link>
  )
}