import { NavBar } from '../components/layout/NavBar'
import { PageHeading } from '../components/ui/PageHeading'
import { stack, essentials } from '../data/stack'

export function Stack() {
  const totalTools = stack.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <>
      <NavBar active="" />

      {/* ═══ HERO ═══ */}
      <PageHeading
        eyebrow="Stack · Dev Environment"
        title="What I work"
        titleAccent="with."
        description="Every tool, language, and framework I've used at least once or twice across projects, coursework, and internships — grouped by where it sits in the workflow. Not a claim of mastery. A record of exposure."
      />

      {/* ═══ STATS STRIP ═══ */}
      <section className="stack-stats-section">
        <div className="stack-container">
          <div className="stack-stats">
            <div className="stack-stat">
              <div className="stack-stat-val">{stack.length}</div>
              <div className="stack-stat-label">Categories</div>
            </div>
            <div className="stack-stat">
              <div className="stack-stat-val">{totalTools}</div>
              <div className="stack-stat-label">Tools listed</div>
            </div>
            <div className="stack-stat">
              <div className="stack-stat-val">2</div>
              <div className="stack-stat-label">Hosting providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ESSENTIALS ═══ */}
      <section className="stack-essentials-section">
        <div className="stack-container">
          <div className="stack-essentials reveal">
            <div className="stack-essentials-head">
              <span className="stack-essentials-label">The essentials</span>
              <span className="stack-essentials-note">if you only read six lines</span>
            </div>

            <div className="stack-essentials-grid">
              {essentials.map(e => (
                <div key={e.name} className="stack-essential">
                  <div className="stack-essential-name">{e.name}</div>
                  <div className="stack-essential-detail">{e.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GROUPS ═══ */}
      <section className="stack-body-section">
        <div className="stack-container">
          <div className="stack-groups">
            {stack.map((group, gi) => (
              <div key={group.label} className={`stack-group reveal delay-${Math.min(gi + 1, 6)}`}>
                <div className="stack-group-head">
                  <span className="stack-group-num">{String(gi + 1).padStart(2, '0')}</span>
                  <span className="stack-group-label">{group.label}</span>
                  <span className="stack-group-line" />
                  <span className="stack-group-count">{group.items.length}</span>
                </div>

                <div className="stack-items">
                  {group.items.map(item => (
                    <div key={item.name} className="stack-item">
                      <div className="stack-item-name">
                        <span className="stack-item-bullet">→</span>
                        {item.name}
                      </div>
                      <div className="stack-item-detail">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} Prateek Saha — Stack
        </span>
      </footer>
    </>
  )
}