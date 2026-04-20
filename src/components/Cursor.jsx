import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot   = useRef(null)
  const ring  = useRef(null)
  const pos   = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 })
  const ring_pos = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 })
  const raf   = useRef(null)

  useEffect(() => {
    // Disable heavy JS cursor logic completely on mobile/touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const loop = () => {
      ring_pos.current.x += (pos.current.x - ring_pos.current.x) * 0.12
      ring_pos.current.y += (pos.current.y - ring_pos.current.y) * 0.12
      if (ring.current) {
        ring.current.style.transform = `translate(${ring_pos.current.x - 20}px, ${ring_pos.current.y - 20}px)`
      }
      raf.current = requestAnimationFrame(loop)
    }

    const onHover = () => {
      dot.current?.classList.add('cursor-hover')
      ring.current?.classList.add('ring-hover')
    }
    const onLeave = () => {
      dot.current?.classList.remove('cursor-hover')
      ring.current?.classList.remove('ring-hover')
    }

    window.addEventListener('mousemove', move)
    raf.current = requestAnimationFrame(loop)

    const interactables = document.querySelectorAll('a,button,.btn,.glass,.project-card')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onHover)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dot}  className="cursor-dot"  />
      <div ref={ring} className="cursor-ring" />
      <style>{`
        .cursor-dot {
          position: fixed; top: 0; left: 0; width: 8px; height: 8px;
          background: #fff; border-radius: 50%; z-index: 99999;
          pointer-events: none; will-change: transform;
          transition: width 0.2s, height 0.2s, background 0.2s;
        }
        .cursor-dot.cursor-hover {
          width: 12px; height: 12px;
          background: var(--purple);
          box-shadow: 0 0 20px var(--purple);
        }
        .cursor-ring {
          position: fixed; top: 0; left: 0; width: 40px; height: 40px;
          border: 1.5px solid rgba(155,93,229,0.6);
          border-radius: 50%; z-index: 99998;
          pointer-events: none; will-change: transform;
          transition: width 0.3s, height 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .cursor-ring.ring-hover {
          width: 56px; height: 56px;
          border-color: var(--purple);
          box-shadow: 0 0 20px rgba(155,93,229,0.4);
        }
        @media (hover: none) { .cursor-dot, .cursor-ring { display: none; } }
      `}</style>
    </>
  )
}
