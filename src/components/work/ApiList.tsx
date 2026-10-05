import { useMemo, useState } from 'react'

export type ApiEndpoint = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  path: string
  description: string
}

export type ApiGroup = {
  title: string
  note?: string
  endpoints: ApiEndpoint[]
}

type Method = ApiEndpoint['method']

const METHOD_ORDER: Method[] = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']

export function ApiList({ groups }: { groups: ApiGroup[] }) {
  const [filter, setFilter] = useState<Method | 'ALL'>('ALL')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const allMethods = useMemo(() => {
    const set = new Set<Method>()
    groups.forEach(g => g.endpoints.forEach(e => set.add(e.method)))
    return METHOD_ORDER.filter(m => set.has(m))
  }, [groups])

  const copyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path)
      setCopiedPath(path)
      setTimeout(() => setCopiedPath(p => (p === path ? null : p)), 1500)
    } catch {
      // Clipboard unavailable — ignore
    }
  }

  const filteredGroups = groups
    .map(g => ({
      ...g,
      endpoints: filter === 'ALL' ? g.endpoints : g.endpoints.filter(e => e.method === filter),
    }))
    .filter(g => g.endpoints.length > 0)

  return (
    <div className="apitable-wrap">
      {/* Filter bar */}
      <div className="apitable-filters">
        <button
          className={`apitable-filter ${filter === 'ALL' ? 'apitable-filter-active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All
        </button>
        {allMethods.map(m => (
          <button
            key={m}
            className={`apitable-filter apitable-filter-method ${filter === m ? 'apitable-filter-active' : ''}`}
            onClick={() => setFilter(filter === m ? 'ALL' : m)}
          >
            <span className={`apitable-method apitable-method-${m.toLowerCase()}`}>{m}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="apitable">
        <table>
          <thead>
            <tr>
              <th className="apitable-th-method">Method</th>
              <th className="apitable-th-path">Endpoint</th>
              <th className="apitable-th-desc">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((g, gi) => (
              <>
                {/* Group header row */}
                <tr key={`group-${gi}`} className="apitable-group-row">
                  <td colSpan={3}>
                    <div className="apitable-group-title">
                      <span>{g.title}</span>
                      {g.note && <span className="apitable-group-note">{g.note}</span>}
                    </div>
                  </td>
                </tr>

                {/* Endpoint rows */}
                {g.endpoints.map((ep, ei) => (
                  <tr
                    key={`${gi}-${ei}`}
                    className="apitable-row"
                    onClick={() => copyPath(ep.path)}
                    title="Click to copy endpoint path"
                  >
                    <td className="apitable-td-method">
                      <span className={`apitable-method apitable-method-${ep.method.toLowerCase()}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="apitable-td-path">
                      <code className="apitable-path">{ep.path}</code>
                      {copiedPath === ep.path && (
                        <span className="apitable-copied">✓ copied</span>
                      )}
                    </td>
                    <td className="apitable-td-desc">{ep.description}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .apitable-wrap {
          margin: 1.5rem 0;
          border: 1px solid var(--border);
          background: var(--card);
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
        }

        /* ── Filter bar ── */
        .apitable-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          background: var(--muted);
        }

        .apitable-filter {
          display: inline-flex;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted-foreground);
          cursor: none;
          transition: all 0.2s;
        }

        .apitable-filter:hover {
          border-color: var(--accent);
          color: var(--foreground);
        }

        .apitable-filter-active {
          border-color: var(--accent);
          background: var(--card);
          color: var(--foreground);
        }

        .apitable-filter-method {
          padding: 0;
          border: none;
          background: transparent;
        }

        .apitable-filter-method .apitable-method {
          padding: 4px 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          font-weight: 600;
        }

        .apitable-filter-method.apitable-filter-active .apitable-method {
          outline: 1px solid var(--accent);
          outline-offset: 0;
        }

        /* ── Table ── */
        .apitable {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
        }

        .apitable table {
          width: 100%;
          min-width: 640px;
          border-collapse: collapse;
        }

        .apitable thead th {
          text-align: left;
          padding: 0.65rem 1rem;
          background: var(--muted);
          color: var(--muted-foreground);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .apitable-th-method { width: 90px; }
        .apitable-th-path { width: 34%; }

        /* ── Group header row ── */
        .apitable-group-row td {
          padding: 0.9rem 1rem 0.5rem;
          background: var(--background);
          border-bottom: 1px solid var(--border);
        }

        .apitable-group-title {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .apitable-group-note {
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          color: var(--muted-foreground);
          text-transform: none;
        }

        /* ── Endpoint row ── */
        .apitable-row {
          cursor: none;
          transition: background 0.15s;
        }

        .apitable-row:hover {
          background: var(--muted);
        }

        .apitable-row:not(:last-child) td {
          border-bottom: 1px solid var(--border);
        }

        .apitable-td-method {
          padding: 0.65rem 1rem;
          vertical-align: top;
          width: 90px;
        }

        .apitable-td-path {
          padding: 0.65rem 1rem;
          vertical-align: top;
          position: relative;
        }

        .apitable-td-desc {
          padding: 0.65rem 1rem;
          vertical-align: top;
          font-size: 0.78rem;
          line-height: 1.55;
          color: var(--secondary-foreground);
          overflow-wrap: break-word;
        }

        .apitable-path {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          color: var(--foreground);
          word-break: break-all;
        }

        .apitable-copied {
          display: inline-block;
          margin-left: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.05em;
          color: var(--accent);
          animation: apitable-copied-fade 1.5s ease forwards;
        }

        @keyframes apitable-copied-fade {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* ── Method badge colors ── */
        .apitable-method {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 3px 8px;
          text-align: center;
          min-width: 52px;
        }

        .apitable-method-get    { background: #0d2a1f; color: #4ade80; }
        .apitable-method-post   { background: #1a2333; color: #60a5fa; }
        .apitable-method-patch  { background: #2a231a; color: #fbbf24; }
        .apitable-method-delete { background: #2a1518; color: #f87171; }
        .apitable-method-put    { background: #231a2a; color: #c084fc; }

        /* ── Mobile — collapse to two columns ── */
        @media (max-width: 640px) {
          .apitable table {
            min-width: 0;
          }
          .apitable-th-desc,
          .apitable-td-desc {
            display: none;
          }
          .apitable-row {
            display: block;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border);
          }
          .apitable-row td {
            display: block;
            padding: 0.15rem 1rem;
            border-bottom: none !important;
          }
          .apitable-td-method {
            width: auto;
          }
          /* Re-show description as its own line under the row */
          .apitable-row .apitable-td-desc {
            display: block;
            padding-top: 0.35rem;
            font-size: 0.78rem;
          }
          .apitable-th-method,
          .apitable-th-path {
            display: none;
          }
          .apitable thead {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}