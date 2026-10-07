import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, Routes, Route } from 'react-router-dom'

interface Props {
  children: ReactNode
}

const variants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -60 },
}

export function PageTransition({ children }: Props) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* ── Terminal wipe overlay (runs on every route change) ── */}
      <motion.div
        key={`wipe-${location.pathname}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 0.7, times: [0, 0.45, 1], ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--accent)',
          transformOrigin: 'left center',
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
        }}
      />

      {/* ── Sliding page content ── */}
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}