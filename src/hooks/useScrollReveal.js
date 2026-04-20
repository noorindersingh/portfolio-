import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}
