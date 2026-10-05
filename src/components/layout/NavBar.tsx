import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { profile } from '../../data/profile'

export function NavBar({ active }: { active: string }) {
  const links = ['about', 'skills', 'projects', 'contact']
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (id: string) => {
    setOpen(false)
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    }
  }

  const goHome = () => {
    setOpen(false)
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(9,9,9,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1E1E1E' : 'none',
        transition: 'all 0.4s',
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}
    >
      <button
        onClick={goHome}
        aria-label="Back to top"
        style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'none' }}
      >
        PS<span style={{ color: 'var(--accent)' }}>.</span>
      </button>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden-mobile">
        {links.map(l => (
          <button
            key={l}
            onClick={() => goToSection(l)}
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: active === l ? 'var(--accent)' : 'var(--muted-foreground)',
              background: 'none', border: 'none', cursor: 'none',
              transition: 'color 0.2s', padding: '4px 0',
            }}
          >{l}</button>
        ))}
        <Link
          to="/lab"
          style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: location.pathname.startsWith('/lab') ? 'var(--accent)' : 'var(--muted-foreground)',
            textDecoration: 'none', cursor: 'none',
            transition: 'color 0.2s', padding: '4px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => {
            if (!location.pathname.startsWith('/lab')) {
              e.currentTarget.style.color = 'var(--muted-foreground)'
            }
          }}
        >
          lab
        </Link>
        <Link
          to="/resume"
          style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: location.pathname === '/resume' ? 'var(--accent)' : 'var(--muted-foreground)',
            textDecoration: 'none', cursor: 'none',
            transition: 'color 0.2s', padding: '4px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => {
            if (location.pathname !== '/resume') {
              e.currentTarget.style.color = 'var(--muted-foreground)'
            }
          }}
        >
          resume
        </Link>
        <a
          href={profile.github}
          target="_blank" rel="noreferrer"
          style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.1em',
            color: 'var(--accent-foreground)', background: 'var(--accent)',
            padding: '6px 16px', textDecoration: 'none', fontWeight: 600,
            transition: 'opacity 0.2s', cursor: 'none',
          }}
        >GitHub ↗</a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', display: 'none' }}
        className="show-mobile"
        aria-label="Menu"
        aria-expanded={open}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></> : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>}
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'rgba(9,9,9,0.98)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}>
          {links.map(l => (
            <button key={l} onClick={() => goToSection(l)}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >{l}</button>
          ))}

          <Link
            to="/lab"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: location.pathname.startsWith('/lab') ? 'var(--accent)' : 'var(--foreground)',
              textDecoration: 'none', cursor: 'pointer', textAlign: 'left',
            }}
          >
            lab
          </Link>

          <Link
            to="/resume"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: location.pathname === '/resume' ? 'var(--accent)' : 'var(--foreground)',
              textDecoration: 'none', cursor: 'pointer', textAlign: 'left',
            }}
          >
            resume
          </Link>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--foreground)',
              textDecoration: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            GitHub ↗
          </a>
        </div>
      )}
    </nav>
  )
}