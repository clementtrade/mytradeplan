'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dots: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    for (let i = 0; i < 40; i++) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        r: Math.random() * 2 + 1,
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(22,163,74,0.04)'
      ctx.lineWidth = 1
      const gap = 40
      for (let x = 0; x < w; x += gap) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gap) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      dots.forEach(d => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > 1) d.vx *= -1
        if (d.y < 0 || d.y > 1) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(22,163,74,0.25)'
        ctx.fill()
      })

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = (dots[i].x - dots[j].x) * w
          const dy = (dots[i].y - dots[j].y) * h
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x * w, dots[i].y * h)
            ctx.lineTo(dots[j].x * w, dots[j].y * h)
            ctx.strokeStyle = `rgba(22,163,74,${0.1 * (1 - dist / 90)})`
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}