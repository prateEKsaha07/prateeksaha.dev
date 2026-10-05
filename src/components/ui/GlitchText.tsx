import type { CSSProperties } from 'react'

export function GlitchText({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ animation: 'glitch 7s infinite' }}>{text}</span>
    </span>
  )
}