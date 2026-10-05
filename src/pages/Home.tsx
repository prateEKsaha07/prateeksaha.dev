import type { CSSProperties } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { useActiveSection } from '../hooks/useActiveSection'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { GlitchText } from '../components/ui/GlitchText'
import { SectionLabel } from '../components/ui/SectionLabel'
import { SkillTag } from '../components/ui/SkillTag'
import { NavBar } from '../components/layout/NavBar'
import { ProjectCard } from '../components/home/ProjectCard'
import { ContactForm } from '../components/home/ContactForm'

export function Home() {
  const typed = useTypewriter(profile.roles)
  const activeSection = useActiveSection(['about', 'skills', 'projects', 'contact'])

  const marqueeItems = Object.values(profile.skills).flat()

  const gridStyle: CSSProperties = {
    position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
    backgroundSize: '80px 80px',
    opacity: 0.4,
    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
  }

  return (
    <>
      <NavBar active={activeSection} />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: 'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 7vw, 6rem) clamp(4rem, 8vw, 6rem)' }}>
        <div style={gridStyle} />

        <div style={{
          position: 'absolute', right: 'clamp(-2rem, -2vw, -1rem)', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(8rem, 22vw, 20rem)',
          lineHeight: 0.85, color: 'transparent', WebkitTextStroke: '1px #1a1a1a',
          userSelect: 'none', zIndex: 0, pointerEvents: 'none',
        }}>PS</div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}
               className="reveal">
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase' }}>Open to opportunities · Fresher</span>
          </div>

          <h1 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(3rem, 9vw, 7.5rem)', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            <GlitchText text={profile.name} />
          </h1>

          <div className="reveal delay-1" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', color: 'var(--muted-foreground)', marginBottom: '2rem', height: '2rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ color: 'var(--accent)' }}>_</span>
            <span>{typed}</span>
            <span style={{ animation: 'blink 1s infinite', color: 'var(--accent)' }}>|</span>
          </div>

          <p className="reveal delay-2" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'var(--secondary-foreground)', maxWidth: '560px', marginBottom: '3rem' }}>
            I build backend services and the data layers behind them. FastAPI, Postgres, RAG pipelines — and a running lab of data work I keep public.
          </p>

          <div className="reveal delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.875rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'var(--accent)', color: 'var(--accent-foreground)',
                padding: '0.875rem 2rem', border: 'none', cursor: 'none',
                animation: 'pulseGlow 3s 3',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              View Projects →
            </button>
            <a
              href={`mailto:${profile.email}`}
              style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--foreground)', padding: '0.875rem 2rem',
                border: '1px solid var(--border)', textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s', cursor: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground)' }}
            >
              Get in Touch
            </a>
          </div>

          <div className="reveal delay-4" style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
            {[
              { label: 'GitHub', href: profile.github },
              { label: 'LinkedIn', href: profile.linkedin },
              { label: 'Email', href: `mailto:${profile.email}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s', borderBottom: '1px solid transparent', cursor: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderBottomColor = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderBottomColor = 'transparent' }}
              >{s.label} ↗</a>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--border), var(--accent))', animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══ MARQUEE ════════════════════════════════════════════════════ */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '0.875rem 0', background: 'var(--muted)' }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)', padding: '0 2rem', whiteSpace: 'nowrap' }}>
              {item} <span style={{ color: 'var(--accent)', margin: '0 1rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ══════════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 7vw, 6rem)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>01 · About</SectionLabel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'start' }}>
            <div>
              <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                I build things<br/>
                <span style={{ color: 'var(--accent)' }}>that work.</span>
              </h2>
              {profile.about.split('\n\n').map((p, i) => (
                <p key={i} className="reveal" style={{ fontSize: '0.9rem', lineHeight: 1.9, color: 'var(--secondary-foreground)', marginBottom: '1rem' }}>{p}</p>
              ))}
              <div className="reveal delay-2" style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Open to relocate', 'Remote-friendly', 'Fresher'].map(tag => (
                  <span key={tag} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', padding: '4px 10px', border: '1px solid var(--border)', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="reveal" style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>Education</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {profile.education.map(e => (
                    <div key={e.degree} style={{ padding: '1rem 1.25rem', background: 'var(--muted)', borderLeft: '2px solid var(--accent)' }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem' }}>{e.degree}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--secondary-foreground)', marginTop: '0.25rem' }}>{e.institution}</div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', color: 'var(--muted-foreground)' }}>{e.duration}</span>
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', color: 'var(--accent)' }}>{e.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal delay-1">
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1rem' }}>Experience</div>
                {profile.experience.map(ex => (
                  <div key={ex.role} style={{ padding: '1.25rem', background: 'var(--muted)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>{ex.role}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '2px' }}>{ex.company}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)' }}>{ex.duration}</div>
                        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)' }}>{ex.location}</div>
                      </div>
                    </div>
                    <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {ex.bullets.map(b => (
                        <li key={b} style={{ fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--secondary-foreground)', listStyleType: 'none', paddingLeft: 0 }}>
                          <span style={{ color: 'var(--accent)', marginRight: '0.5rem' }}>→</span>{b}
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
      <section id="skills" style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 7vw, 6rem)', background: 'var(--muted)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>02 · Skills</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', marginBottom: '3rem', lineHeight: 1 }}>
            What I work with
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
            {Object.entries(profile.skills).map(([cat, skills], i) => (
              <div key={cat} className={`reveal delay-${Math.min(i + 1, 6)}`} style={{ padding: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.875rem' }}>{cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skills.map(s => <SkillTag key={s} label={s} />)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '4rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Certifications</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
              {profile.certs.map((c, i) => (
                <div key={c.name} className={`reveal delay-${Math.min(i + 1, 6)}`} style={{ padding: '1rem 1.25rem', background: 'var(--card)', borderLeft: '2px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>{c.issuer}</div>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.62rem', color: 'var(--accent)', marginTop: '0.5rem' }}>{c.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ═══════════════════════════════════════════════════ */}
      <section id="projects" style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 7vw, 6rem)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>03 · Projects</SectionLabel>
          <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', marginBottom: '3rem', lineHeight: 1 }}>
            Selected work
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' }}>
            {projects.map((p, i) => <ProjectCard key={p.title} p={p} idx={i} />)}
          </div>

          <div className="reveal" style={{ marginTop: '3rem', textAlign: 'center' }}>
            <a href={profile.github} target="_blank" rel="noreferrer"
              style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: '0.75rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--foreground)', padding: '0.875rem 2.5rem',
                border: '1px solid var(--border)', textDecoration: 'none', display: 'inline-block',
                transition: 'all 0.2s', cursor: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground)' }}
            >View all on GitHub ↗</a>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 7vw, 6rem)', background: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionLabel>04 · Contact</SectionLabel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(3rem, 6vw, 6rem)' }}>
            <div>
              <h2 className="reveal" style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                Let's build<br/><span style={{ color: 'var(--accent)' }}>something.</span>
              </h2>
              <p className="reveal delay-1" style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--secondary-foreground)', marginBottom: '2.5rem' }}>
                Open to full-time roles, internships, freelance work, and collaborations. Based in Bhilai — willing to relocate anywhere in India or work remotely.
              </p>

              <div className="reveal delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Email', val: profile.email, href: `mailto:${profile.email}` },
                  { label: 'LinkedIn', val: 'prateeksaha', href: profile.linkedin },
                  { label: 'GitHub', val: 'prateEKsaha07', href: profile.github },
                  { label: 'Location', val: profile.location, href: null },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase', minWidth: '64px' }}>{item.label}</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    {item.href
                      ? <a href={item.href} target="_blank" rel="noreferrer"
                          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.72rem', color: 'var(--foreground)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--foreground)')}
                        >{item.val}</a>
                      : <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>{item.val}</span>
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
      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — Built with React + Vite
        </span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[{ l: 'GH', h: profile.github }, { l: 'LI', h: profile.linkedin }, { l: 'ML', h: `mailto:${profile.email}` }].map(s => (
            <a key={s.l} href={s.h} target="_blank" rel="noreferrer" aria-label={s.l}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--muted-foreground)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            >{s.l}</a>
          ))}
        </div>
      </footer>

      {/* Global styles */}
      <style>{`
        /* Custom cursor — hidden by default */
        .cursor-dot, .cursor-ring { display: none; }

        /* Show only on real pointer devices (not touch), and only if user hasn't requested reduced motion */
        @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
          .cursor-dot, .cursor-ring { display: block; }
          body, a, button, input, textarea, [role="button"] { cursor: none !important; }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,255,133,0); }
          50% { box-shadow: 0 0 28px 6px rgba(0,255,133,0.22); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%,49% { opacity: 1; }
          50%,100% { opacity: 0; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes glitch {
          0%,80%,100% { clip-path: none; transform: translate(0); filter: none; }
          82% { clip-path: polygon(0 15%,100% 15%,100% 35%,0 35%); transform: translate(-4px,1px); filter: hue-rotate(90deg); }
          84% { clip-path: polygon(0 60%,100% 60%,100% 80%,0 80%); transform: translate(4px,-1px); filter: hue-rotate(-90deg); }
          86% { clip-path: none; transform: translate(0); filter: none; }
        }
      `}</style>
    </>
  )
}