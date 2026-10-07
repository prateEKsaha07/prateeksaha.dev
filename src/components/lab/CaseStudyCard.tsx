import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CaseStudy } from '../../data/caseStudies'

export function CaseStudyCard({ c }: { c: CaseStudy }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/lab/${c.slug}`}
      className={`cs-card${hov ? ' cs-card-hov' : ''}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="cs-card-accent" aria-hidden="true" />

      {/* Meta row */}
      <div className="cs-card-meta">
        <span className="cs-card-num">{c.num}</span>
        {c.metadata?.rows && (
          <span className="cs-card-rows">{c.metadata.rows}</span>
        )}
      </div>

      {/* Tag */}
      <div className="cs-card-tag">{c.tag}</div>

      {/* Title */}
      <h3 className="cs-card-title">{c.title}</h3>

      {/* Synopsis — clamped to 3 lines */}
      <p className="cs-card-desc">{c.desc}</p>

      {/* Tech tags — first 4 + overflow count */}
      <div className="cs-card-tech">
        {c.tech.slice(0, 4).map(t => (
          <span key={t} className="cs-card-tech-tag">{t}</span>
        ))}
        {c.tech.length > 4 && (
          <span className="cs-card-tech-more">+{c.tech.length - 4}</span>
        )}
      </div>

      {/* Footer */}
      <div className="cs-card-footer">Read case study →</div>
    </Link>
  )
}