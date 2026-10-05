import type { ReactNode } from 'react'

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)' }}>{children}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}