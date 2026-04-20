export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      borderTop: '1px solid var(--border)',
      padding: '48px 48px 32px',
      textAlign: 'center',
      background: 'rgba(5,5,16,0.8)'
    }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: 'var(--purple)' }}>&lt;</span>
          <span style={{ background: 'linear-gradient(135deg,var(--purple),var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NS</span>
          <span style={{ color: 'var(--purple)' }}>/&gt;</span>
        </span>
      </div>
      <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: 8 }}>
        Built with React, Three.js, GSAP & Framer Motion
      </p>
      <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>
        © {year} Noorinder Singh. All rights reserved.
      </p>
    </footer>
  )
}
