import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { PageTransition } from '@mesqueeb/react-page-transition'
import '@mesqueeb/react-page-transition/animations.css'

export function RoutesWrapper({ children }: { children: ReactNode }) {
  const location = useLocation()
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <PageTransition
      preset={prefersReducedMotion ? 'slide' : 'moveToLeftFromRight'}
      transitionKey={location.pathname}
      className="page-transition-wrapper"
      contentClassName="page-transition-content"
    >
      {children}
    </PageTransition>
  )
}