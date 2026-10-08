import { useState, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { useActiveSection } from '../hooks/useActiveSection'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { SectionLabel } from '../components/ui/SectionLabel'
import { SkillTag } from '../components/ui/SkillTag'
import { NavBar } from '../components/layout/NavBar'
import { ProjectCard } from '../components/home/ProjectCard'
import { ContactForm } from '../components/home/ContactForm'
import { DataPipeline } from '../components/home/DataPipeline'
import TechText from '../components/ui/TechText'
import { useIsMobile } from '../hooks/useIsMobile'

export function Home() {
  const typed = useTypewriter(profile.roles)
  const activeSection = useActiveSection(['about', 'skills', 'projects', 'contact'])
  const isMobile = useIsMobile(700)

  const marqueeItems = Object.values(profile.skills).flat()

  const [showAllProjects, setShowAllProjects] = useState(false)
  const [showAllCerts, setShowAllCerts] = useState(false)

  const INITIAL_PROJECTS = 6
  const INITIAL_CERTS = 4

  const visibleProjects = showAllProjects ? projects : projects.slice(0, INITIAL_PROJECTS)
  const visibleCerts = showAllCerts ? profile.certs : profile.certs.slice(0, INITIAL_CERTS)

  const hiddenProjectsCount = Math.max(0, projects.length - INITIAL_PROJECTS)
  const hiddenCertsCount = Math.max(0, profile.certs.length - INITIAL_CERTS)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const io = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        }),
        { threshold: 0.12 }
      )
      els.forEach(el => io.observe(el))
      return () => io.disconnect()
    }, 50)

    return () => clearTimeout(timeout)
  }, [showAllProjects, showAllCerts])

  return (
    <>
      <NavBar active={activeSection} />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section id="hero" className="hero-section">
        <div className="hero-grid-bg" />

        <div className="hero-watermark" aria-hidden="true">PS</div>

        <div className="hero-grid">
          <div className="hero-visual">
  <DataPipeline />
</div>

          <div className="hero-content">
            <div className="reveal hero-status">
              <span className="hero-status-dot" />
              <span className="hero-status-text">Open to opportunities · Fresher</span>
            </div>

            <div className="reveal hero-name-wrap">
              <TechText
                text={profile.name}
                fontFamily="Outfit, sans-serif"
                fontSize={isMobile ? 160 : 260}
                fontWeight={900}
                letterSpacing={-0.04}
                color="#ffffff"
                accentColor="#00FF41"
                reach={isMobile ? 140 : 220}
                softness={0.55}
                dashLength={4}
                dashGap={3}
                strokeWidth={1.4}
                lineStyle="dashed"
                reveal="letter"
                specks={isMobile ? 8 : 18}
                selection
                labels={false}
                draggable={!isMobile}
                sweep
                speed={isMobile ? 0.8 : 1.1}
              />
            </div>

            <div className="reveal delay-1 hero-typed">
              <span style={{ color: 'var(--accent)' }}>_</span>
              <span>{typed}</span>
              <span className="hero-cursor">|</span>
            </div>

            <p className="reveal delay-2 hero-paragraph">
              I build backend services and the data layers behind them. FastAPI, Postgres, RAG pipelines — and a running lab of data work I keep public.
            </p>

            <div className="reveal delay-3 hero-ctas">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-cta hero-cta-primary"
              >
                View Projects →
              </button>
              <a href={`mailto:${profile.email}`} className="hero-cta hero-cta-secondary">
                Get in Touch
              </a>
            </div>

            <div className="reveal delay-4 hero-socials">
              {[
                { label: 'GitHub', href: profile.github },
                { label: 'LinkedIn', href: profile.linkedin },
                { label: 'Email', href: `mailto:${profile.email}` },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hero-social-link">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span className="hero-scroll-label">scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ═══ MARQUEE — visible on all screens ══════════════════════════ */}
      <div className="marquee-wrap hide-mobile">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ══════════════════════════════════════════════════════ */}
      <section id="about" className="section-pad">
        <div className="container">
          <SectionLabel>01 · About</SectionLabel>

          <div className="about-grid">
            <div>
              <h2 className="reveal section-heading">
                I build things<br/>
                <span style={{ color: 'var(--accent)' }}>that work.</span>
              </h2>
              {profile.about.split('\n\n').map((p, i) => (
                <p key={i} className="reveal about-paragraph">{p}</p>
              ))}
            </div>

            <div>
              <div className="reveal about-tags">
                {['Open to relocate', 'Remote-friendly', 'Fresher'].map(tag => (
                  <span key={tag} className="about-tag">{tag}</span>
                ))}
              </div>

              <div className="reveal about-block">
                <div className="about-block-label">Education</div>
                <div className="about-block-list">
                  {profile.education.map(e => (
                    <div key={e.degree} className="edu-card">
                      <div className="edu-degree">{e.degree}</div>
                      <div className="edu-institution">{e.institution}</div>
                      <div className="edu-meta">
                        <span className="edu-duration">{e.duration}</span>
                        <span className="edu-status">{e.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal delay-1">
                <div className="about-block-label">Experience</div>
                {profile.experience.map(ex => (
                  <div key={ex.role} className="exp-card">
                    <div className="exp-head">
                      <div>
                        <div className="exp-role">{ex.role}</div>
                        <div className="exp-company">{ex.company}</div>
                      </div>
                      <div className="exp-right">
                        <div className="exp-meta">{ex.duration}</div>
                        <div className="exp-meta">{ex.location}</div>
                      </div>
                    </div>
                    <ul className="exp-bullets">
                      {ex.bullets.map(b => (
                        <li key={b} className="exp-bullet">
                          <span className="exp-arrow">→</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═════════════════════════════════════════════════════ */}
      <section id="skills" className="section-pad section-muted">
        <div className="container">
          <SectionLabel>02 · Skills</SectionLabel>
          <h2 className="reveal section-heading">What I work with</h2>

          <div className="skills-grid">
            {Object.entries(profile.skills).map(([cat, skills], i) => (
              <div key={cat} className={`reveal delay-${Math.min(i + 1, 6)} skill-card`}>
                <div className="skill-category">{cat}</div>
                <div className="skill-tag-wrap">
                  {skills.map(s => <SkillTag key={s} label={s} />)}
                </div>
              </div>
            ))}
          </div>

          <div className="certs-wrap">
            <div className="certs-label">Certifications</div>
            <div className="certs-grid">
              {visibleCerts.map((c, i) => (
                <div key={c.name} className={`reveal delay-${Math.min(i + 1, 6)} cert-card`}>
                  <div className="cert-name">{c.name}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                  <div className="cert-year">{c.year}</div>
                </div>
              ))}
            </div>

            {hiddenCertsCount > 0 && (
              <div className="reveal expand-wrap">
                <button onClick={() => setShowAllCerts(v => !v)} className="expand-toggle">
                  {showAllCerts
                    ? '− Show fewer ↑'
                    : `+ ${hiddenCertsCount} more ${hiddenCertsCount === 1 ? 'certification' : 'certifications'} ↓`}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ═══════════════════════════════════════════════════ */}
      <section id="projects" className="section-pad">
        <div className="container">
          <SectionLabel>03 · Projects</SectionLabel>
          <h2 className="reveal section-heading">Selected work</h2>

          <div className="projects-grid">
            {visibleProjects.map((p, i) => <ProjectCard key={p.title} p={p} idx={i} />)}
          </div>

          {hiddenProjectsCount > 0 && (
            <div className="reveal expand-wrap">
              <button onClick={() => setShowAllProjects(v => !v)} className="expand-toggle">
                {showAllProjects
                  ? '− Show fewer ↑'
                  : `+ ${hiddenProjectsCount} more ${hiddenProjectsCount === 1 ? 'project' : 'projects'} ↓`}
              </button>
            </div>
          )}

          <div className="reveal github-cta-wrap">
            <a href={profile.github} target="_blank" rel="noreferrer" className="github-cta">
              View all on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ════════════════════════════════════════════════════ */}
      <section id="contact" className="section-pad section-muted section-contact">
        <div className="container">
          <SectionLabel>04 · Contact</SectionLabel>

          <div className="contact-grid">
            <div>
              <h2 className="reveal section-heading">
                Let's build<br/><span style={{ color: 'var(--accent)' }}>something.</span>
              </h2>
              <p className="reveal delay-1 contact-paragraph">
                Open to full-time roles, internships, freelance work, and collaborations. Based in Bhilai — willing to relocate anywhere in India or work remotely.
              </p>

              <div className="reveal delay-2 contact-list">
                {[
                  { label: 'Email', val: profile.email, href: `mailto:${profile.email}` },
                  { label: 'LinkedIn', val: 'prateeksaha', href: profile.linkedin },
                  { label: 'GitHub', val: 'prateEKsaha07', href: profile.github },
                  { label: 'Location', val: profile.location, href: null },
                ].map(item => (
                  <div key={item.label} className="contact-row">
                    <span className="contact-label">{item.label}</span>
                    <div className="contact-line" />
                    {item.href
                      ? <a href={item.href} target="_blank" rel="noreferrer" className="contact-value contact-link">{item.val}</a>
                      : <span className="contact-value contact-static">{item.val}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal delay-1">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════════════════ */}
      <footer className="footer">
        <span className="footer-copy">
          © {new Date().getFullYear()} Prateek Saha — Built with React + Vite
        </span>
        <div className="footer-socials">
          {[{ l: 'GH', h: profile.github }, { l: 'LI', h: profile.linkedin }, { l: 'ML', h: `mailto:${profile.email}` }].map(s => (
            <a key={s.l} href={s.h} target="_blank" rel="noreferrer" aria-label={s.l} className="footer-link">
              {s.l}
            </a>
          ))}
        </div>
      </footer>
    </>
  )
}