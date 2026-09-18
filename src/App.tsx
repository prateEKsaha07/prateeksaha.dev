import { useEffect, useRef, useState } from 'react'

// ─── Data ──────────────────────────────────────────────────────────────────
const DATA = {
  name: 'Prateek Saha',
  title: 'Software Developer · Data Engineer · AI Builder',
  location: 'Bhilai, Chhattisgarh, India',
  email: 'prateeksaha963@gmail.com',
  phone: '+91 6261156183',
  github: 'https://github.com/prateEKsaha07',
  linkedin: 'https://www.linkedin.com/in/prateeksaha',
  roles: ['Backend Developer', 'Data Scientist', 'AI/ML Engineer', 'Full Stack Dev'],

  about: `I build end-to-end systems that sit at the intersection of backend engineering, data science, and applied AI. Currently pursuing MCA at CSVTU while shipping real products — from reverse marketplaces to RAG-powered study companions to vehicle-detection pipelines trained on Indian road data.

I care about depth over breadth: clean APIs, well-structured data, models that actually work in the wild.`,

  education: [
    { degree: 'MCA', institution: 'Swami Vivekanand Technical University', duration: '2025 – 2027', status: 'Pursuing' },
    { degree: 'BCA', institution: 'Hemchand Yadav Vishwavidyalaya, Durg', duration: '2021 – 2025', status: 'Completed' },
  ],

  experience: [
    {
      role: 'Process Executive Intern',
      company: 'AugTech NextWealth IT Services',
      duration: 'Jun 2025 – Jan 2026',
      location: 'Bhilai, CG',
      bullets: [
        '3D LiDAR annotation & validation using GT Studio',
        'Vehicle, traffic-signal & occlusion annotation for AI/ML datasets',
        'Maintained 95%+ accuracy across high-volume QA workflows',
        'Performed quality checks against productivity targets',
      ],
    },
  ],

  skills: {
    'Languages':     ['Python', 'SQL', 'JavaScript', 'C++', 'Java', 'PHP'],
    'Backend':       ['FastAPI', 'REST APIs', 'JWT Auth', 'Django', 'Supabase'],
    'Frontend':      ['React', 'Tailwind CSS', 'HTML/CSS', 'Vite'],
    'AI / ML':       ['YOLOv8', 'RAG', 'FAISS', 'LLMs', 'Cohere', 'TensorFlow', 'PyTorch'],
    'Data & BI':     ['Power BI', 'MS Excel', 'Pandas', 'NumPy', 'DAX'],
    'Databases':     ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite'],
    'CV / Annotation': ['OpenCV', 'YOLOv8', 'CVAT', 'GT Studio', 'LiDAR'],
    'DevOps / Tools': ['Git', 'GitHub', 'Vercel', 'Render', 'VS Code'],
  },

  projects: [
    {
      title: 'MarketFlip',
      tag: 'Full Stack · Marketplace',
      desc: 'Reverse marketplace where buyers post requests and sellers compete through live bids. Built REST APIs, role-based auth, OTP verification, real-time chat, and ML features: price suggestion, bid ranking, demand forecasting, fraud detection.',
      tech: ['React 19', 'FastAPI', 'Supabase', 'PostgreSQL', 'Tailwind', 'ML'],
      live: 'https://marketflip-mauve.vercel.app',
      github: 'https://github.com/prateEKsaha07/marketflip',
      accent: '#00FF85',
      num: '01',
    },
    {
      title: 'AI Study Companion',
      tag: 'RAG · AI · Full Stack',
      desc: 'Full-stack AI study assistant using RAG over uploaded materials. Per-user FAISS vector indexes, Cohere embeddings, quiz generation, weak-topic detection, adaptive roadmaps, and learning analytics dashboard.',
      tech: ['React', 'FastAPI', 'FAISS', 'Cohere', 'Supabase', 'Recharts'],
      live: 'https://rag-v2-gules.vercel.app/',
      github: 'https://github.com/prateEKsaha07/RAG_v2',
      accent: '#A78BFF',
      num: '02',
    },
    {
      title: 'SENTINEL.v8',
      tag: 'Computer Vision · ML',
      desc: 'YOLOv8 vehicle detection system trained on custom Indian traffic data (IDD + Bhilai scenes, ~979 images). XML→YOLO conversion pipeline, multi-epoch experiments, Streamlit inference UI.',
      tech: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'Streamlit'],
      live: null,
      github: 'https://github.com/prateEKsaha07/Sentinel.v8',
      accent: '#FF6B35',
      stats: [{ label: 'Precision', val: '0.81' }, { label: 'mAP@50', val: '0.63' }],
      num: '03',
    },
    {
      title: 'AdventureWorks BI',
      tag: 'Data Analytics · Power BI',
      desc: 'End-to-end sales analysis: SQL extraction from AdventureWorks MySQL, star-schema data model, Power Query transformation, and a full interactive Power BI dashboard with DAX measures for margins, customer ranking, and budget variance.',
      tech: ['MySQL', 'SQL', 'Power BI', 'DAX', 'Power Query'],
      live: null,
      github: 'https://github.com/prateEKsaha07/CRM-Sales-Overview-Data-Analysis',
      accent: '#FFB800',
      num: '04',
    },
    {
      title: 'Ask-Your-Database',
      tag: 'LLM · Text-to-SQL',
      desc: 'Chat-style app converting natural language to SQL via Groq LLaMA 3. Schema-aware query generation, auto error correction, Pandas output rendering, and auto chart generation for 2-column results.',
      tech: ['Python', 'Streamlit', 'Groq API', 'LLaMA 3', 'SQLite', 'Pandas'],
      live: null,
      github: 'https://github.com/prateEKsaha07',
      accent: '#00C2FF',
      num: '05',
    },
    {
      title: 'Loan Approval ML',
      tag: 'Machine Learning',
      desc: 'Classification project predicting loan approval from applicant features. Compared KNN, Random Forest, SVM, Logistic Regression — Random Forest achieved 98.32% accuracy. Full EDA, encoding, and model evaluation pipeline.',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Seaborn'],
      live: null,
      github: 'https://github.com/prateEKsaha07/Loan-Approval-Prediction',
      stats: [{ label: 'Best Accuracy', val: '98.32%' }],
      accent: '#FF4C8B',
      num: '06',
    },
  ],

  certs: [
    { name: 'Web Development Bootcamp', issuer: 'Colt Steele · Udemy', year: '2025' },
    { name: 'Machine Learning & Data Science', issuer: 'Kirill Eremenko · Udemy', year: '2026 (Ongoing)' },
    { name: 'Learn SQL using MySQL', issuer: 'Prateek Narang · Scaler', year: '2024' },
    { name: 'Data Structures & Algorithms (C++)', issuer: 'Aditya Jain · Scaler', year: '2024' },
  ],
}

// ─── Hooks ─────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) { setTimeout(() => setDeleting(true), pause); return }
        setCharIdx(c => c + 1)
      } else {
        setDisplay(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); setCharIdx(0); return }
        setCharIdx(c => c - 1)
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [words, wordIdx, charIdx, deleting, speed, pause])

  return display
}

function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Skip entirely if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move)
    let raf: number
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x - 4}px`
        dotRef.current.style.top = `${pos.current.y - 4}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x - 20}px`
        ringRef.current.style.top = `${ring.current.y - 20}px`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  return { dotRef, ringRef }
}

// ─── Sub-components ────────────────────────────────────────────────────────
function NavBar({ active }: { active: string }) {
  const links = ['about', 'skills', 'projects', 'contact']
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
            onClick={() => scrollTo(l)}
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: active === l ? 'var(--accent)' : 'var(--muted-foreground)',
              background: 'none', border: 'none', cursor: 'none',
              transition: 'color 0.2s', padding: '4px 0',
            }}
          >{l}</button>
        ))}
        <a
          href={DATA.github}
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
            <button key={l} onClick={() => scrollTo(l)}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >{l}</button>
          ))}
        </div>
      )}
    </nav>
  )
}

function GlitchText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ animation: 'glitch 7s infinite' }}>{text}</span>
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)' }}>{children}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}

function SkillTag({ label }: { label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem',
        padding: '4px 10px', border: `1px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        color: hov ? 'var(--accent)' : 'var(--muted-foreground)',
        transition: 'all 0.2s', cursor: 'none', whiteSpace: 'nowrap',
      }}
    >{label}</span>
  )
}

function ProjectCard({ p, idx }: { p: typeof DATA.projects[0]; idx: number }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={`reveal delay-${Math.min(idx + 1, 6)}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--card)' : 'var(--muted)',
        border: `1px solid ${hov ? p.accent : 'var(--border)'}`,
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: hov ? '80px' : '0', height: '3px',
        background: p.accent, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>{p.num}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" aria-label={`Live demo of ${p.title}`}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: p.accent, textDecoration: 'none', letterSpacing: '0.1em', cursor: 'none' }}>
              LIVE ↗
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" aria-label={`GitHub repo for ${p.title}`}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.65rem', color: 'var(--muted-foreground)', textDecoration: 'none', letterSpacing: '0.1em', cursor: 'none' }}>
              GH ↗
            </a>
          )}
        </div>
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: p.accent, letterSpacing: '0.15em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{p.tag}</div>
      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', lineHeight: 1.1, marginBottom: '0.875rem', letterSpacing: '-0.02em' }}>{p.title}</h3>
      <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'var(--secondary-foreground)', marginBottom: '1.25rem' }}>{p.desc}</p>

      {'stats' in p && p.stats && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
          {p.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.25rem', color: p.accent }}>{s.val}</div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {p.tech.map(t => (
          <span key={t} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', padding: '2px 8px', background: 'var(--secondary)', color: 'var(--muted-foreground)', letterSpacing: '0.05em' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// access key
const WEB3FORMS_ACCESS_KEY = '79f17008-68af-4e65-868e-e1b537e5d375'
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio contact from ${form.name}`,
          from_name: 'Portfolio Contact Form',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', message: '' })
        setTimeout(() => setSent(false), 4000)
      } else {
        setError('Something went wrong. Please email me directly.')
      }
    } catch {
      setError('Network error. Please email me directly.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--muted)', border: '1px solid var(--border)',
    color: 'var(--foreground)', fontFamily: 'Inter,sans-serif', fontWeight: 300,
    fontSize: '0.875rem', padding: '0.875rem 1rem', width: '100%',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'none',
  }

  return (
    <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
        <input
          placeholder="Your name" required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
        <input
          type="email" placeholder="Email address" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
      </div>
      <textarea
        placeholder="What's on your mind?" required rows={5} value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        style={{ ...inputStyle, resize: 'vertical' }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: sent ? '#222' : 'var(--accent)',
          color: sent ? 'var(--accent)' : 'var(--accent-foreground)',
          border: `1px solid ${sent ? 'var(--accent)' : 'transparent'}`,
          fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.875rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0.875rem 2.5rem',
          cursor: loading ? 'wait' : 'none',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s',
          animation: !sent && !loading ? 'pulseGlow 3s 3' : 'none',
          alignSelf: 'flex-start',
        }}
      >
        {loading ? 'Sending…' : sent ? '✓ Sent!' : 'Send Message →'}
      </button>
      {error && (
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.7rem', color: '#FF4C8B', margin: 0 }}>
          {error}
        </p>
      )}
    </form>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  useReveal()
  const { dotRef, ringRef } = useCursor()
  const typed = useTypewriter(DATA.roles)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const sections = ['about', 'skills', 'projects', 'contact']
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.4 }
    )
    sections.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  const marqueeItems = Object.values(DATA.skills).flat()

  const gridStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
    backgroundSize: '80px 80px',
    opacity: 0.4,
    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
  }

  return (
    <>
      {/* Custom cursor — hidden on touch devices + respects reduced-motion (CSS below) */}
      <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', pointerEvents: 'none', zIndex: 99999, mixBlendMode: 'difference' }} />
      <div ref={ringRef} className="cursor-ring" style={{ position: 'fixed', width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,255,133,0.35)', pointerEvents: 'none', zIndex: 99998 }} />

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
            <GlitchText text={DATA.name} />
          </h1>

          <div className="reveal delay-1" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', color: 'var(--muted-foreground)', marginBottom: '2rem', height: '2rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ color: 'var(--accent)' }}>_</span>
            <span>{typed}</span>
            <span style={{ animation: 'blink 1s infinite', color: 'var(--accent)' }}>|</span>
          </div>

          <p className="reveal delay-2" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: 1.8, color: 'var(--secondary-foreground)', maxWidth: '560px', marginBottom: '3rem' }}>
            Building end-to-end systems at the intersection of backend engineering, data science, and applied AI. Based in Bhilai, India.
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
              href={`mailto:${DATA.email}`}
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
              { label: 'GitHub', href: DATA.github },
              { label: 'LinkedIn', href: DATA.linkedin },
              { label: 'Email', href: `mailto:${DATA.email}` },
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
              {DATA.about.split('\n\n').map((p, i) => (
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
                  {DATA.education.map(e => (
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
                {DATA.experience.map(ex => (
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
            {Object.entries(DATA.skills).map(([cat, skills], i) => (
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
              {DATA.certs.map((c, i) => (
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
            {DATA.projects.map((p, i) => <ProjectCard key={p.title} p={p} idx={i} />)}
          </div>

          <div className="reveal" style={{ marginTop: '3rem', textAlign: 'center' }}>
            <a href={DATA.github} target="_blank" rel="noreferrer"
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
                  { label: 'Email', val: DATA.email, href: `mailto:${DATA.email}` },
                  { label: 'LinkedIn', val: 'prateeksaha', href: DATA.linkedin },
                  { label: 'GitHub', val: 'prateEKsaha07', href: DATA.github },
                  { label: 'Location', val: DATA.location, href: null },
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
          {[{ l: 'GH', h: DATA.github }, { l: 'LI', h: DATA.linkedin }, { l: 'ML', h: `mailto:${DATA.email}` }].map(s => (
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
        @media (max-width: 700px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 701px) {
          .show-mobile { display: none !important; }
        }

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