import { useRef } from 'react'

const skillGroups = [
  {
    label: 'Languages',
    color: 'var(--purple)',
    skills: [
      { name: 'Java', level: 85, icon: '☕' },
      { name: 'C / DSA', level: 80, icon: '⚡' },
      { name: 'HTML & CSS', level: 90, icon: '🎨' },
      { name: 'JavaScript', level: 78, icon: '🟨' },
      { name: 'Python', level: 55, icon: '🐍' },
      { name: 'SQL', level: 70, icon: '🗄️' },
    ]
  },
  {
    label: 'Frameworks',
    color: 'var(--blue)',
    skills: [
      { name: 'React', level: 50, icon: '⚛️' },
      { name: 'Next.js', level: 40, icon: '▲' },
      { name: 'Android SDK', level: 75, icon: '📱' },
    ]
  },
  {
    label: 'Tools & Strengths',
    color: 'var(--pink)',
    skills: [
      { name: 'VS Code', level: 95, icon: '💻' },
      { name: 'Android Studio', level: 80, icon: '🛠️' },
      { name: 'AI Development', level: 85, icon: '🤖' },
      { name: 'UI/UX Design', level: 80, icon: '✏️' },
      { name: 'Problem Solving', level: 90, icon: '🧠' },
    ]
  }
]

function SkillCard({ name, level, icon, color }) {
  const ref = useRef(null)

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20
    ref.current.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`
  }
  const handleLeave = () => {
    ref.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)'
  }

  return (
    <div
      ref={ref}
      className="glass skill-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ padding: '20px', transition: 'transform 0.2s ease', textAlign: 'center' }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 12 }}>{name}</div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 100,
          background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.3))`,
          width: `${level}%`,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)'
        }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{level}%</div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" style={{ background: 'none' }}>
      <div className="reveal">
        <span className="section-tag">What I Know</span>
        <h2 className="section-title">Skills & <span className="grad-cyan">Expertise</span></h2>
        <p className="section-subtitle">A growing arsenal of tools and technologies for building smart digital products.</p>
      </div>

      {skillGroups.map((group) => (
        <div key={group.label} style={{ marginBottom: 52 }} className="reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 3, height: 24, background: group.color, borderRadius: 2, boxShadow: `0 0 10px ${group.color}` }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: group.color, fontFamily: 'var(--font-mono)' }}>{group.label}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
            {group.skills.map(s => (
              <SkillCard key={s.name} {...s} color={group.color} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
