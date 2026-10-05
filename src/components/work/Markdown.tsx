import { Mermaid } from './Mermaid'

type Block =
  | { type: 'prose'; text: string }
  | { type: 'mermaid'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

function parseTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null

  const headerLine = lines[0]
  const separatorLine = lines[1]

  // Header must contain pipes
  if (!headerLine.includes('|')) return null

  // Separator must be like |---|---| or | :--- | ---: |
  if (!/^\s*\|?[\s:|-]+\|?\s*$/.test(separatorLine)) return null
  if (!separatorLine.includes('-')) return null

  const splitRow = (line: string): string[] =>
    line
      .replace(/^\s*\|/, '')
      .replace(/\|\s*$/, '')
      .split('|')
      .map(c => c.trim())

  const headers = splitRow(headerLine)
  const rows = lines.slice(2).map(splitRow)

  return { headers, rows }
}

function parseContent(content: string): Block[] {
  const blocks: Block[] = []
  const lines = content.split('\n')
  let i = 0
  let proseBuffer: string[] = []

  const flushProse = () => {
    if (proseBuffer.length > 0) {
      const text = proseBuffer.join('\n').trim()
      if (text) blocks.push({ type: 'prose', text })
      proseBuffer = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    // Code fence
    const fenceMatch = line.match(/^```(\w*)\s*$/)
    if (fenceMatch) {
      flushProse()
      const lang = fenceMatch[1]
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      const codeText = codeLines.join('\n')
      if (lang === 'mermaid') {
        blocks.push({ type: 'mermaid', text: codeText })
      } else {
        blocks.push({ type: 'code', lang, text: codeText })
      }
      i++
      continue
    }

    // Table detection — a line with pipes followed by a separator line
    if (line.includes('|') && i + 1 < lines.length) {
      // Collect consecutive lines that look like table rows
      const tableLines: string[] = []
      let j = i
      while (j < lines.length && (lines[j].includes('|') || lines[j].trim() === '')) {
        if (lines[j].trim() === '') break
        tableLines.push(lines[j])
        j++
      }

      const parsed = parseTable(tableLines)
      if (parsed) {
        flushProse()
        blocks.push({ type: 'table', headers: parsed.headers, rows: parsed.rows })
        i = j
        continue
      }
    }

    proseBuffer.push(line)
    i++
  }

  flushProse()
  return blocks
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseContent(content)

  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'mermaid') {
          return <Mermaid key={i} chart={b.text} />
        }
        if (b.type === 'code') {
          return (
            <pre key={i} style={{
              padding: '1rem 1.25rem',
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              fontSize: '0.75rem',
              fontFamily: 'JetBrains Mono, monospace',
              lineHeight: 1.6,
              overflowX: 'auto',
              margin: '1.5rem 0',
              whiteSpace: 'pre',
            }}>
              {b.text}
            </pre>
          )
        }
        if (b.type === 'table') {
          return (
            <div key={i} style={{ overflowX: 'auto', margin: '1.5rem 0', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
                <thead>
                  <tr>
                    {b.headers.map((h, hi) => (
                      <th key={hi} style={{
                        textAlign: 'left',
                        padding: '0.7rem 1rem',
                        background: 'var(--card)',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontSize: '0.6rem',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 ? 'var(--muted)' : 'transparent' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '0.6rem 1rem',
                          color: 'var(--foreground)',
                          borderBottom: '1px solid var(--border)',
                          lineHeight: 1.55,
                          overflowWrap: 'break-word',
                        }}>
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        return b.text.split('\n\n').map((p, j) => (
          <Paragraph key={`${i}-${j}`} text={p.trim()} />
        ))
      })}
    </>
  )
}

function Paragraph({ text }: { text: string }) {
  if (!text) return null

  if (text.startsWith('**') && text.endsWith('**') && !text.slice(2, -2).includes('**')) {
    return (
      <p style={{ fontWeight: 500, color: 'var(--foreground)', marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        {text.slice(2, -2)}
      </p>
    )
  }

  if (text.startsWith('- ') || text.startsWith('* ')) {
    const items = text.split('\n').map(l => l.replace(/^[-*]\s+/, ''))
    return (
      <ul style={{ margin: '0.75rem 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--secondary-foreground)' }}>
            {renderInline(it)}
          </li>
        ))}
      </ul>
    )
  }

  if (text.includes('\n- ') || text.includes('\n* ')) {
    const parts = text.split(/\n(?=[-*]\s)/)
    return (
      <>
        {parts.map((part, i) => <Paragraph key={i} text={part} />)}
      </>
    )
  }

  return (
    <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--secondary-foreground)', marginBottom: '1rem' }}>
      {renderInline(text)}
    </p>
  )
}

function renderInline(text: string) {
  const parts: (string | JSX.Element)[] = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('**')) {
      parts.push(<strong key={key++} style={{ color: 'var(--foreground)', fontWeight: 500 }}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      parts.push(<code key={key++} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82em', padding: '1px 5px', background: 'var(--secondary)', color: 'var(--accent)' }}>{token.slice(1, -1)}</code>)
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length > 0 ? parts : text
}