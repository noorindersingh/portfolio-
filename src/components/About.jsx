import { useEffect, useRef } from 'react'

const stats = [
  { value: 2, label: 'AI Projects' },
  { value: 3, label: 'Certifications' },
  { value: 5, label: 'Languages' },
  { value: 1, label: 'Campus Role' },
]

function CountUp({ target }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const step = () => {
          start += Math.ceil(target / 40)
          if (start >= target) { el.textContent = target + '+'; return }
          el.textContent = start + '+'
          requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>0+</span>
}

export default function About() {
  return (
    <section id="about">
      <div className="reveal">
        <span className="section-tag">Who I Am</span>
        <h2 className="section-title">Building the Future<br />with <span className="grad-purple">Artificial Intelligence</span></h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="about-grid">
        {/* Left: Bio */}
        <div className="reveal-left">
          <div className="glass" style={{ padding: 40 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--purple), var(--blue))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900, color: '#fff',
                boxShadow: 'var(--glow-purple)', flexShrink: 0
              }}>N</div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>Noorinder Singh</h3>
                <p style={{ color: 'var(--purple)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>AI Developer & Designer</p>
              </div>
            </div>

            <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 20 }}>
              I'm an AI developer passionate about building intelligent systems that solve real-world problems. 
              Currently focused on voice-controlled AI assistants and automation tools that make everyday life smarter.
            </p>
            <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 28 }}>
              I blend strong programming foundations with a designer's eye for UX — creating products that are not just functional, but beautiful and intuitive.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <a href="https://github.com/noorindersingh" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: 13 }}>
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/noorinder-singh-678a08372" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: 13 }}>
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right: Stats + highlights */}
        <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {stats.map(s => (
              <div key={s.label} className="glass" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--purple)', textShadow: 'var(--glow-purple)', lineHeight: 1 }}>
                  <CountUp target={s.value} />
                </div>
                <div style={{ color: 'var(--gray)', fontSize: '0.85rem', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Highlight cards */}
          {[
            { icon: '🤖', title: 'AI-First Mindset', desc: 'Every project starts with intelligence at its core' },
            { icon: '🎨', title: 'Design Driven', desc: 'Beautiful UX is non-negotiable in every build' },
            { icon: '📱', title: 'Mobile & Desktop', desc: 'Building for Android & laptop automation tools' },
          ].map(h => (
            <div key={h.title} className="glass" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28, lineHeight: 1 }}>{h.icon}</span>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>{h.title}</h4>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){ .about-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  )
}
