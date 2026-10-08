import React, { useEffect, useRef, useState } from 'react'

interface Node {
  x: number
  y: number
  speed: number
  size: number
  alpha: number
  pulse: number
}

/** Node budget scales with viewport — mobile gets a fraction of desktop's load. */
function getNodeCount(): number {
  if (typeof window === 'undefined') return 40
  const w = window.innerWidth
  if (w < 700) return 12
  if (w < 968) return 20
  return 40
}

/** Skip connection checks below this width (still drawn, just cheap). */
function getConnectionDistance(): number {
  if (typeof window === 'undefined') return 150
  const w = window.innerWidth
  if (w < 700) return 100
  if (w < 968) return 130
  return 150
}

/** Throttle target FPS — mobile GPUs are happier at 30fps for this kind of work. */
function getTargetFps(): number {
  if (typeof window === 'undefined') return 60
  const w = window.innerWidth
  if (w < 700) return 30
  if (w < 968) return 45
  return 60
}

export const DataPipeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const hoverRef = useRef<boolean>(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // ── Size the canvas to its container (with capped DPR) ──
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75)

    const applySize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      // Draw in CSS pixels, let ctx scale by DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    applySize()

    // ── Perf flags ──
    const isMobile = window.innerWidth < 968
    const useShadows = !isMobile
    const accentColor = '#00FF41'
    const nodeCount = getNodeCount()
    const connectionDistance = getConnectionDistance()
    const connectionDistanceSq = connectionDistance * connectionDistance
    const targetFps = getTargetFps()
    const frameInterval = 1000 / targetFps  // ms between frames

    // ── Node pool ──
    const nodes: Node[] = []
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 1.5,
        size: isMobile ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    // ── Reusable hex-alpha suffix lookup (avoids .toString(16).padStart every frame) ──
    const HEX = new Array(256)
    for (let i = 0; i < 256; i++) HEX[i] = i.toString(16).padStart(2, '0')

    let lastFrameTime = 0

    const draw = (now: number) => {
      animationRef.current = requestAnimationFrame(draw)

      // ── Frame throttle: skip frames to hit target FPS ──
      const elapsed = now - lastFrameTime
      if (elapsed < frameInterval) return
      lastFrameTime = now - (elapsed % frameInterval)

      ctx.clearRect(0, 0, width, height)
      const speedMultiplier = hoverRef.current ? 3 : 1

      // ── Draw connections first (behind nodes) ──
      for (let i = 0; i < nodeCount; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodeCount; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq > connectionDistanceSq) continue

          const distance = Math.sqrt(distSq)
          const lineAlpha = (1 - distance / connectionDistance) * 0.15
          const alphaByte = Math.max(0, Math.min(255, (lineAlpha * 255) | 0))

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `${accentColor}${HEX[alphaByte]}`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // ── Update + draw nodes ──
      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i]

        node.x += node.speed * speedMultiplier
        if (node.x > width + 10) {
          node.x = -10
          node.y = Math.random() * height
        }

        node.pulse += 0.05
        const currentAlpha = node.alpha + Math.sin(node.pulse) * 0.1
        const alphaByte = Math.max(0, Math.min(255, (currentAlpha * 255) | 0))

        if (useShadows) {
          ctx.shadowBlur = hoverRef.current ? 15 : 5
          ctx.shadowColor = accentColor
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = `${accentColor}${HEX[alphaByte]}`
        ctx.fill()
      }

      // Reset shadow once, not per node
      if (useShadows) ctx.shadowBlur = 0
    }

    // ── Pause when off-screen or tab hidden ──
    let visible = true
    let running = false

    const start = () => {
      if (running || !visible) return
      running = true
      lastFrameTime = 0
      animationRef.current = requestAnimationFrame(draw)
    }

    const stop = () => {
      running = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else if (visible) start()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // ── Resize (debounced) ──
    let resizeTimer: number | undefined
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        applySize()
        for (const n of nodes) {
          if (n.x > width) n.x = Math.random() * width
          if (n.y > height) n.y = Math.random() * height
        }
      }, 120)
    }
    window.addEventListener('resize', handleResize)

    start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) window.clearTimeout(resizeTimer)
    }
  }, [])

  const handleMouseEnter = () => {
    hoverRef.current = true
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    hoverRef.current = false
    setIsHovered(false)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '320px',
        overflow: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'crosshair',
          opacity: 0.8,
        }}
      />

      {/* Edge fades — pointer-events:none so hover still works */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, var(--background), transparent, var(--background))',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, var(--background), transparent, var(--background))',
          pointerEvents: 'none',
        }}
      />

      {/* Terminal status overlay */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'var(--accent)',
          opacity: 0.5,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
          textAlign: 'right',
        }}
      >
        <div>SYSTEM_STATUS: ACTIVE</div>
        <div>PIPELINE_FLOW: {isHovered ? 'ACCELERATED' : 'STABLE'}</div>
        <div>DATA_NODES: {getNodeCount()}</div>
        <div>LATENCY: 12ms</div>
      </div>
    </div>
  )
}