import { Link, useLocation } from 'react-router-dom'
import { NavBar } from '../components/layout/NavBar'
import { SectionLabel } from '../components/ui/SectionLabel'

export function NotFound() {
  const location = useLocation()

  return (
    <>
      <NavBar active="" />

      <section className="nf-section">
        <div className="nf-grid-bg" aria-hidden="true" />

        <div className="nf-container">
          <div className="nf-label reveal">
            <SectionLabel>404 · Route not found</SectionLabel>
          </div>

          <h1 className="nf-title reveal delay-1">
            This page<br/>
            <span style={{ color: 'var(--accent)' }}>doesn't exist.</span>
          </h1>

          <p className="nf-desc reveal delay-2">
            The URL{' '}
            <code className="nf-code-inline nf-code-blink">{location.pathname}</code>
            {' '}doesn't match any route on this site. It may have been moved, mistyped, or never existed.
          </p>

          <div className="nf-ctas reveal delay-3">
            <Link to="/" className="nf-cta nf-cta-primary">
              ← Back home
            </Link>
            <Link to="/lab" className="nf-cta nf-cta-secondary">
              Browse the Lab
            </Link>
          </div>
        </div>

        {/* Big drifting 404 behind everything */}
        <div className="nf-headline" aria-hidden="true">
          <span className="nf-code nf-code-glitch">404</span>
        </div>
      </section>

      <footer style={{ padding: '2rem clamp(1.5rem, 7vw, 6rem)', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} Prateek Saha — 404
        </span>
      </footer>

      <style>{`
        .nf-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: clamp(6rem, 12vw, 10rem) clamp(1.5rem, 7vw, 6rem) clamp(4rem, 8vw, 6rem);
        }

        /* ── Drifting grid background ── */
        .nf-grid-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: 0.35;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent);
          animation: nf-grid-drift 40s linear infinite;
        }

        @keyframes nf-grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 80px 80px; }
        }

        .nf-container {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        /* ── Big 404 watermark ── */
        .nf-headline {
          position: absolute;
          right: -2rem;
          top: 50%;
          z-index: 0;
          pointer-events: none;
          user-select: none;
        }

        .nf-code {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(10rem, 30vw, 26rem);
          line-height: 0.85;
          color: transparent;
          -webkit-text-stroke: 1px #161616;
          opacity: 0.6;
          animation: nf-float 12s ease-in-out infinite;
        }

        @keyframes nf-float {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-12px, -24px); }
        }

        /* Rare glitch flash on the big code */
        .nf-code-glitch {
          animation: nf-float 12s ease-in-out infinite, nf-glitch 8s infinite;
        }

        @keyframes nf-glitch {
          0%, 88%, 100% {
            -webkit-text-stroke: 1px #161616;
            transform: translate(0, 0);
          }
          90% {
            -webkit-text-stroke: 1px rgba(0, 255, 133, 0.4);
            transform: translate(-2px, 2px);
          }
          92% {
            -webkit-text-stroke: 1px #161616;
            transform: translate(2px, -2px);
          }
          94% {
            -webkit-text-stroke: 1px rgba(0, 255, 133, 0.2);
            transform: translate(0, 0);
          }
        }

        @media (max-width: 900px) {
          .nf-headline {
            right: -6rem;
          }
          .nf-code {
            opacity: 0.4;
          }
        }

        /* ── Content ── */
        .nf-label {
          margin-bottom: 1rem;
        }

        .nf-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(2.25rem, 6vw, 4rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem;
          overflow-wrap: break-word;
        }

        .nf-desc {
          font-size: clamp(0.875rem, 1.4vw, 1rem);
          line-height: 1.8;
          color: var(--secondary-foreground);
          max-width: 560px;
          margin: 0 0 2.5rem;
          overflow-wrap: break-word;
        }

        /* ── Inline code with arrival blink ── */
        .nf-code-inline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85em;
          padding: 2px 6px;
          background: var(--secondary);
          color: var(--accent);
          word-break: break-all;
        }

        .nf-code-blink {
          animation: nf-code-appear 0.7s ease 0.5s 3;
        }

        @keyframes nf-code-appear {
          0%, 100% { background: var(--secondary); }
          50%      { background: var(--accent); color: var(--accent-foreground); }
        }

        /* ── CTAs ── */
        .nf-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .nf-cta {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.875rem 1.75rem;
          cursor: none;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .nf-cta-primary {
          background: var(--accent);
          color: var(--accent-foreground);
          border: 1px solid var(--accent);
          animation: nf-cta-glow 0.9s ease 1;
        }

        .nf-cta-primary:hover {
          transform: translateY(-2px);
        }

        @keyframes nf-cta-glow {
          0%   { box-shadow: 0 0 0 0 rgba(0, 255, 133, 0); }
          40%  { box-shadow: 0 0 28px 6px rgba(0, 255, 133, 0.35); }
          100% { box-shadow: 0 0 0 0 rgba(0, 255, 133, 0); }
        }

        .nf-cta-secondary {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--foreground);
          background: transparent;
          border: 1px solid var(--border);
        }

        .nf-cta-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
      `}</style>
    </>
  )
}