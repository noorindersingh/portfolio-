import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const projects = [
  {
    id: 1,
    name: 'Azeez',
    subtitle: 'Offline AI Assistant',
    emoji: '🤖',
    color: '#9B5DE5',
    gradient: 'linear-gradient(135deg, #9B5DE5, #00B4D8)',
    description: 'A fully offline, voice-controlled mobile AI assistant built for Android. No internet required — everything runs locally on device.',
    features: ['Wake word detection', 'Voice calling', 'Spotify music control', 'Phone lock automation', 'Google search integration'],
    tech: ['Java', 'Kotlin', 'Android Studio', 'ML on-device'],
    status: 'Completed',
    github: 'https://github.com/noorindersingh',
  },
  {
    id: 2,
    name: 'Desktop AI',
    subtitle: 'Laptop Automation Assistant',
    emoji: '💻',
    color: '#00B4D8',
    gradient: 'linear-gradient(135deg, #00B4D8, #00F5FF)',
    description: 'A Python-based desktop AI assistant focused on laptop automation, voice control, and local AI processing without cloud dependency.',
    features: ['Voice control interface', 'Local AI processing', 'Desktop automation', 'File management', 'App launching'],
    tech: ['Python', 'Local AI', 'Voice Recognition'],
    status: 'In Progress 🔨',
    github: 'https://github.com/noorindersingh',
  },
]

function ProjectCard({ project }) {
  const [flipped, setFlipped]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (flipped) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 16
    cardRef.current.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`
  }
  const handleMouseLeave = () => {
    if (!flipped) cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'
  }

  return (
    <>
      <div
        ref={cardRef}
        className="project-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setFlipped(!flipped)}
        style={{
          height: 360, position: 'relative', cursor: 'none',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
          transform: flipped ? 'perspective(800px) rotateY(180deg)' : 'perspective(800px) rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 36, display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(20px)', overflow: 'hidden',
        }}>
          {/* Gradient accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: project.gradient, borderRadius: '24px 24px 0 0' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${project.color}15, transparent 70%)`, pointerEvents: 'none' }} />

          <div style={{ fontSize: 48, marginBottom: 16 }}>{project.emoji}</div>
          <div style={{ fontSize: '0.75rem', color: project.color, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
            {project.status}
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>{project.name}</h3>
          <p style={{ color: 'var(--gray)', fontSize: '0.95rem', marginBottom: 'auto' }}>{project.subtitle}</p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
            {project.tech.map(t => (
              <span key={t} style={{
                background: `${project.color}20`, border: `1px solid ${project.color}40`,
                color: project.color, padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem'
              }}>{t}</span>
            ))}
          </div>

          <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: 16, textAlign: 'center' }}>Click to flip ↺</p>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 32, display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(20px)', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: project.gradient, borderRadius: '24px 24px 0 0' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12, color: project.color }}>{project.name} — Details</h3>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>{project.description}</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {project.features.map(f => (
              <li key={f} style={{ color: 'var(--white)', fontSize: '0.85rem', display: 'flex', gap: 8 }}>
                <span style={{ color: project.color }}>▸</span>{f}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
            <a href={project.github} target="_blank" rel="noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: 13 }}
              onClick={e => e.stopPropagation()}>
              GitHub ↗
            </a>
            <button
              className="btn btn-outline"
              style={{ padding: '10px 16px', fontSize: 13 }}
              onClick={(e) => { e.stopPropagation(); setExpanded(true) }}>
              Expand
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(5,5,16,0.92)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
            }}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass"
              style={{ maxWidth: 600, width: '100%', padding: 48, position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setExpanded(false)} style={{
                position: 'absolute', top: 20, right: 20, background: 'none', border: 'none',
                color: 'var(--gray)', fontSize: 24, cursor: 'none'
              }}>✕</button>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{project.emoji}</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>{project.name}</h2>
              <p style={{ color: project.color, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: 20 }}>{project.subtitle} · {project.status}</p>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 24 }}>{project.description}</p>
              <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Key Features</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                {project.features.map(f => (
                  <li key={f} style={{ color: 'var(--gray)', display: 'flex', gap: 10 }}>
                    <span style={{ color: project.color }}>▸</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {project.tech.map(t => (
                  <span key={t} style={{ background: `${project.color}20`, border: `1px solid ${project.color}40`, color: project.color, padding: '6px 16px', borderRadius: 100, fontSize: '0.8rem' }}>{t}</span>
                ))}
              </div>
              <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-primary">View on GitHub ↗</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="reveal">
        <span className="section-tag">What I've Built</span>
        <h2 className="section-title">Featured <span className="grad-pink">Projects</span></h2>
        <p className="section-subtitle">Click a card to flip and reveal details. Click Expand for the full view.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
        {projects.map((p, i) => (
          <div key={p.id} className={`reveal`} style={{ transitionDelay: `${i * 0.15}s` }}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
