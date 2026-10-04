import { useEffect, useRef } from 'react'

const COLORS = ['#ffb020', '#ff8a00', '#34d399', '#5eb1ff', '#f472b6', '#ffffff']

export default function Confetti() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    const bits = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.8,
      v: 2 + Math.random() * 3.5,
      s: 5 + Math.random() * 6,
      r: Math.random() * 6,
      w: (Math.random() - 0.5) * 0.15,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
    let frame = 0
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const b of bits) {
        b.y += b.v
        b.r += 0.1
        b.x += Math.sin(b.r) * 0.8 + b.w * 10
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.r)
        ctx.fillStyle = b.c
        ctx.fillRect(-b.s / 2, -b.s / 3, b.s, b.s * 0.6)
        ctx.restore()
      }
      if (++frame < 360) raf = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="confetti" aria-hidden />
}
