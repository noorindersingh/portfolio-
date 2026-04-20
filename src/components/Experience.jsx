export default function Experience() {
  return (
    <section id="experience">
      <div className="reveal">
        <span className="section-tag">Professional Journey</span>
        <h2 className="section-title">Experience & <span className="grad-cyan">Roles</span></h2>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
          background: 'linear-gradient(to bottom, var(--purple), var(--blue), transparent)',
          marginLeft: 20
        }} />

        <div className="reveal" style={{ paddingLeft: 64, position: 'relative' }}>
          {/* Timeline dot */}
          <div style={{
            position: 'absolute', left: 12, top: 36, width: 18, height: 18,
            borderRadius: '50%', background: 'var(--purple)',
            boxShadow: 'var(--glow-purple)', animation: 'pulse-glow 2s ease-in-out infinite'
          }} />

          <div className="glass" style={{ padding: 40 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--purple)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
                  CURRENT ROLE
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>Campus Ambassador</h3>
                <p style={{ color: 'var(--blue)', fontWeight: 600 }}>Vivekananda Global University (VGU)</p>
              </div>
              <div style={{
                background: 'rgba(155,93,229,0.1)', border: '1px solid rgba(155,93,229,0.3)',
                borderRadius: 100, padding: '8px 20px', fontSize: '0.85rem', color: 'var(--purple)',
                alignSelf: 'flex-start'
              }}>
                🟢 Active
              </div>
            </div>

            <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 24 }}>
              Representing VGU as a campus ambassador — promoting academic initiatives, engaging with students, 
              and bridging communication between the university and the student community. Building leadership and 
              public engagement skills.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Leadership', 'Communication', 'Community Building', 'Event Promotion'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                  borderRadius: 100, padding: '6px 16px', fontSize: '0.8rem', color: 'var(--gray)'
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
