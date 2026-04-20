const certs = [
  {
    name: 'EXIN BCS Artificial Intelligence Essentials',
    issuer: 'EXIN | BCS',
    icon: '🧠',
    color: '#9B5DE5',
    year: '2024',
    desc: 'Official certification in AI fundamentals, ethics, and applications.'
  },
  {
    name: 'Java Programming',
    issuer: 'LinkedIn Learning',
    icon: '☕',
    color: '#00B4D8',
    year: '2024',
    desc: 'Core Java programming, OOP principles, and application development.'
  },
  {
    name: 'Python Programming',
    issuer: 'LinkedIn Learning',
    icon: '🐍',
    color: '#F15BB5',
    year: '2024',
    desc: 'Python fundamentals, scripting, and automation techniques.'
  },
]

export default function Certifications() {
  return (
    <section id="certifications">
      <div className="reveal">
        <span className="section-tag">Verified Learning</span>
        <h2 className="section-title">Certifications & <span className="grad-purple">Credentials</span></h2>
        <p className="section-subtitle">Verified credentials that back up my skill set.</p>
      </div>

      <div className="grid-3">
        {certs.map((c, i) => (
          <div
            key={c.name}
            className="glass reveal"
            style={{
              padding: 36, position: 'relative', overflow: 'hidden',
              transitionDelay: `${i * 0.12}s`
            }}
          >
            {/* Shimmer overlay */}
            <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none' }} />

            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />

            <div style={{ fontSize: 44, marginBottom: 16 }}>{c.icon}</div>

            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: c.color, letterSpacing: 2, marginBottom: 10 }}>
              {c.issuer} · {c.year}
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, marginBottom: 12 }}>{c.name}</h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem', lineHeight: 1.6 }}>{c.desc}</p>

            {/* Badge glow */}
            <div style={{
              marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${c.color}20`, border: `1px solid ${c.color}40`,
              borderRadius: 100, padding: '6px 14px', fontSize: '0.75rem', color: c.color
            }}>
              ✓ Certified
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
