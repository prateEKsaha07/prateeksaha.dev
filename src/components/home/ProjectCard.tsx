import { useState } from 'react'
import { projects } from '../../data/projects'

export function ProjectCard({ p, idx }: { p: typeof projects[0]; idx: number }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={`reveal delay-${Math.min(idx + 1, 6)}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--card)' : 'var(--muted)',
        border: `1px solid ${hov ? p.accent : 'var(--border)'}`,
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: hov ? '80px' : '0', height: '3px',
        background: p.accent, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>{p.num}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" aria-label={`Live demo of ${p.title}`}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: p.accent, textDecoration: 'none', letterSpacing: '0.1em', cursor: 'none' }}>
              LIVE ↗
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" aria-label={`GitHub repo for ${p.title}`}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', textDecoration: 'none', letterSpacing: '0.1em', cursor: 'none' }}>
              GH ↗
            </a>
          )}
        </div>
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: p.accent, letterSpacing: '0.15em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{p.tag}</div>
      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', lineHeight: 1.1, marginBottom: '0.875rem', letterSpacing: '-0.02em' }}>{p.title}</h3>
      <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--secondary-foreground)', marginBottom: '1.25rem' }}>{p.desc}</p>

      {'stats' in p && p.stats && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
          {p.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.25rem', color: p.accent }}>{s.val}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {p.tech.map(t => (
          <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', padding: '2px 8px', background: 'var(--secondary)', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}