import { useEffect, useRef } from 'react'

export function useCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
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
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { dotRef, ringRef }
}