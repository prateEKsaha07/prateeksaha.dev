import { useState } from 'react'
import { NavBar } from '../components/layout/NavBar'
import { SectionLabel } from '../components/ui/SectionLabel'
import { resume } from '../data/resume'

export function Resume() {
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Prateek_Saha_Resume.pdf'
    link.download = 'Prateek_Saha_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(resume.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback — user can still copy manually from the visible email
    }
  }

  return (
    <>
      <NavBar active="" />

      {/* ═══ HERO STRIP ════════════════════════════════════════════════ */}
      <section className="rs-hero no-print">
        <div className="rs-container">
          <SectionLabel>Resume</SectionLabel>

          <h1 className="rs-title">
            {resume.name}<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          <p className="rs-subtitle">
            {resume.title}
          </p>

          <div className="rs-actions">
            <a
              href="/Prateek_Saha_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rs-btn rs-btn-primary"
            >
              Preview PDF ↗
            </a>
            <button onClick={handleDownload} className="rs-btn">
              Download ↓
            </button>
            <button onClick={handleCopyEmail} className="rs-btn">
              {copied ? '✓ Copied' : 'Copy Email'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ RESUME BODY ═══════════════════════════════════════════════ */}
      <section className="rs-body-section">
        <div className="rs-container">
          <div className="rs-body">

            {/* ── Contact ── */}
            <div className="rs-section rs-section-contact">
              <div className="rs-contact-grid">
                <div>
                  <span className="rs-contact-label">Email</span>
                  <a href={`mailto:${resume.email}`} className="rs-contact-value">{resume.email}</a>
                </div>
                <div>
                  <span className="rs-contact-label">Phone</span>
                  <span className="rs-contact-value">{resume.phone}</span>
                </div>
                <div>
                  <span className="rs-contact-label">Location</span>
                  <span className="rs-contact-value">{resume.location}</span>
                </div>
                <div>
                  <span className="rs-contact-label">GitHub</span>
                  <a href={resume.github} target="_blank" rel="noreferrer" className="rs-contact-value">
                    {resume.github.replace('https://github.com/', '')}
                  </a>
                </div>
                <div>
                  <span className="rs-contact-label">LinkedIn</span>
                  <a href={resume.linkedin} target="_blank" rel="noreferrer" className="rs-contact-value">
                    {resume.linkedin.replace('https://www.linkedin.com/in/', '')}
                  </a>
                </div>
              </div>
            </div>

            {/* ── Summary ── */}
            <div className="rs-section">
              <SectionLabel>Summary</SectionLabel>
              <p className="rs-paragraph">{resume.summary}</p>
            </div>

            {/* ── Projects ── */}
            <div className="rs-section">
              <SectionLabel>Projects</SectionLabel>
              <div className="rs-list">
                {resume.projects.map(p => (
                  <div key={p.title} className="rs-entry">
                    <div className="rs-entry-head">
                      <div className="rs-entry-title-row">
                        <h3 className="rs-entry-title">{p.title}</h3>
                        <div className="rs-entry-links no-print">
                          {p.live && (
                            <a href={p.live} target="_blank" rel="noreferrer" className="rs-entry-link">
                              Live ↗
                            </a>
                          )}
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noreferrer" className="rs-entry-link">
                              Repo ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="rs-tech-row">
                        {p.tech.map(t => (
                          <span key={t} className="rs-tech-pill">{t}</span>
                        ))}
                      </div>
                    </div>
                    <p className="rs-entry-desc">{p.desc}</p>
                    {p.bullets && p.bullets.length > 0 && (
                      <ul className="rs-bullets">
                        {p.bullets.map(b => (
                          <li key={b} className="rs-bullet">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Experience ── */}
            <div className="rs-section">
              <SectionLabel>Experience</SectionLabel>
              <div className="rs-list">
                {resume.experience.map(ex => (
                  <div key={ex.role} className="rs-entry">
                    <div className="rs-entry-head">
                      <div className="rs-entry-title-row">
                        <h3 className="rs-entry-title">{ex.role}</h3>
                        <span className="rs-entry-meta">{ex.duration}</span>
                      </div>
                      <div className="rs-entry-subhead">
                        <span className="rs-entry-company">{ex.company}</span>
                        <span className="rs-entry-location">{ex.location}</span>
                      </div>
                    </div>
                    <ul className="rs-bullets">
                      {ex.bullets.map(b => (
                        <li key={b} className="rs-bullet">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Education ── */}
            <div className="rs-section">
              <SectionLabel>Education</SectionLabel>
              <div className="rs-list">
                {resume.education.map(e => (
                  <div key={e.degree} className="rs-entry">
                    <div className="rs-entry-title-row">
                      <h3 className="rs-entry-title">
                        {e.degree} — <span className="rs-entry-company">{e.institution}</span>
                      </h3>
                      <span className="rs-entry-meta">{e.duration}</span>
                    </div>
                    <div className="rs-entry-status">{e.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="rs-section">
              <SectionLabel>Skills</SectionLabel>
              <div className="rs-skills-grid">
                {Object.entries(resume.skills).map(([cat, items]) => (
                  <div key={cat} className="rs-skill-group">
                    <div className="rs-skill-cat">{cat}</div>
                    <div className="rs-skill-list">
                      {items.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Certifications ── */}
            <div className="rs-section rs-section-last">
              <SectionLabel>Certifications</SectionLabel>
              <div className="rs-list">
                {resume.certifications.map(c => (
                  <div key={c.name} className="rs-cert-row">
                    <span className="rs-cert-name">{c.name}</span>
                    <span className="rs-cert-issuer">{c.issuer}</span>
                    <span className="rs-cert-year">{c.year}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Resume
        </span>
      </footer>

      {/* ═══ SCOPED STYLES ══════════════════════════════════════════════ */}
      <style>{`
        .rs-container {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
        }

        .rs-hero {
          padding: clamp(6rem, 10vw, 9rem) clamp(1.25rem, 5vw, 6rem) clamp(2rem, 4vw, 3rem);
        }

        .rs-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          margin: 0 0 0.75rem;
        }

        .rs-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(0.7rem, 1.4vw, 0.85rem);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          margin: 0 0 2rem;
        }

        .rs-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .rs-btn {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.875rem 1.75rem;
          background: transparent;
          color: var(--foreground);
          border: 1px solid var(--border);
          cursor: none;
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .rs-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .rs-btn-primary {
          background: var(--accent);
          color: var(--accent-foreground);
          border-color: var(--accent);
        }

        .rs-btn-primary:hover {
          background: transparent;
          color: var(--accent);
        }

        .rs-body-section {
          padding: 0 clamp(1.25rem, 5vw, 6rem) clamp(4rem, 8vw, 6rem);
        }

        .rs-body {
          background: transparent;
        }

        .rs-section {
          margin-bottom: 3rem;
        }

        .rs-section-last {
          margin-bottom: 0;
        }

        .rs-section-contact {
          margin-bottom: 2.5rem;
        }

        .rs-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
          gap: 1.25rem 2rem;
        }

        .rs-contact-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.35rem;
        }

        .rs-contact-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--foreground);
          text-decoration: none;
          transition: color 0.2s;
          word-break: break-word;
        }

        .rs-contact-value:hover {
          color: var(--accent);
        }

        .rs-paragraph {
          font-size: 0.9rem;
          line-height: 1.85;
          color: var(--secondary-foreground);
          margin: 0;
          overflow-wrap: break-word;
        }

        .rs-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .rs-entry {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .rs-entry-head {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .rs-entry-title-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .rs-entry-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.01em;
          margin: 0;
          color: var(--foreground);
        }

        .rs-entry-company {
          color: var(--accent);
          font-weight: 600;
        }

        .rs-entry-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted-foreground);
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .rs-entry-subhead {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--muted-foreground);
        }

        .rs-entry-location {
          opacity: 0.8;
        }

        .rs-entry-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--accent);
          letter-spacing: 0.1em;
        }

        .rs-entry-links {
          display: flex;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .rs-entry-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted-foreground);
          text-decoration: none;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .rs-entry-link:hover {
          color: var(--accent);
        }

        .rs-entry-desc {
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--secondary-foreground);
          margin: 0;
          overflow-wrap: break-word;
        }

        .rs-tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .rs-tech-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          padding: 2px 8px;
          background: var(--secondary);
          color: var(--muted-foreground);
          letter-spacing: 0.05em;
        }

        .rs-bullets {
          list-style: none;
          padding: 0;
          margin: 0.25rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .rs-bullet {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--secondary-foreground);
          padding-left: 1.25rem;
          position: relative;
        }

        .rs-bullet::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--accent);
        }

        .rs-skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          gap: 1.25rem 2rem;
        }

        .rs-skill-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .rs-skill-cat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .rs-skill-list {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--foreground);
          line-height: 1.6;
          word-break: break-word;
        }

        .rs-cert-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 0.5rem 1rem;
          align-items: baseline;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .rs-cert-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .rs-cert-name {
          font-size: 0.85rem;
          color: var(--foreground);
          font-weight: 500;
        }

        .rs-cert-issuer {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted-foreground);
        }

        .rs-cert-year {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: var(--accent);
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .rs-cert-row {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
        }
      `}</style>
    </>
  )
}