import { useEffect, useRef, useState } from 'react'

let mermaidInitialized = false

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              background: '#0A0A0A',
              primaryColor: '#141414',
              primaryTextColor: '#E5E5E5',
              primaryBorderColor: '#1E1E1E',
              lineColor: '#4a4a4a',
              secondaryColor: '#181818',
              tertiaryColor: '#111111',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
            },
            flowchart: { curve: 'basis', padding: 16 },
            er: { useMaxWidth: true, fontSize: 12 },
          })
          mermaidInitialized = true
        }

        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg: rendered } = await mermaid.render(id, chart.trim())

        if (!cancelled) {
          setSvg(rendered)
          setError('')
        }
      } catch (e) {
        if (!cancelled) {
          setError(String(e))
          setSvg('')
        }
      }
    }

    render()
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <pre style={{
        padding: '1rem',
        background: 'var(--muted)',
        border: '1px solid #3a2020',
        color: '#ff8888',
        fontSize: '0.75rem',
        overflowX: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        Mermaid error: {error}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      className="work-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}