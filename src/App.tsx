import { Routes, Route } from 'react-router-dom'
import { useCursor } from './hooks/useCursor'
import { useReveal } from './hooks/useReveal'
import { Home } from './pages/Home'
import { Lab } from './pages/Lab'
import { CaseStudy } from './pages/CaseStudy'

export default function App() {
  useReveal()
  const { dotRef, ringRef } = useCursor()

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(0,255,133,0.35)',
          pointerEvents: 'none',
          zIndex: 99998,
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/lab/:slug" element={<CaseStudy />} />
      </Routes>
    </>
  )
}