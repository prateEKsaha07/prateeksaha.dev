import { useState } from 'react'

export function SkillTag({ label }: { label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'JetBrains Mono,monospace',
        fontSize: '0.7rem',
        padding: '4px 10px',
        border: `1px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        color: hov ? 'var(--accent)' : 'var(--muted-foreground)',
        transition: 'all 0.2s',
        cursor: 'none',
        whiteSpace: 'nowrap',
      }}
    >{label}</span>
  )
}