import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Resume() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="resume">
      <div className="reveal">
        <span className="section-tag">Curriculum Vitae</span>
        <h2 className="section-title">My <span className="grad-blue">Resume</span></h2>
        <p className="section-subtitle">
          Get a comprehensive look at my professional experience, skills, and educational background.
        </p>
      </div>

      <div className="reveal glass" style={{ padding: '60px 40px', textAlign: 'center', marginTop: 20 }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: 16 }}>Ready to collaborate?</h3>
        <p style={{ color: 'var(--gray)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
          You can preview my resume directly here or download a PDF copy for your records.
        </p>
        
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '16px 36px', fontSize: '1rem', cursor: 'pointer' }}
          >
            👁️ View Resume
          </button>
          
          <a 
            href="https://drive.google.com/uc?export=download&id=1Sxm1Jv0PuQ8iLiMM-rYIQj2D51XNtJ80" 
            className="btn btn-outline"
            style={{ padding: '16px 36px', fontSize: '1rem', cursor: 'pointer' }}
            download
          >
            ⬇️ Download PDF
          </a>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(5, 5, 16, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '40px 20px'
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '100%', maxWidth: 900, height: '100%', maxHeight: '85vh',
                background: 'var(--bg2)', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0,180,216,0.2)',
                border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Resume Preview</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: '1.5rem', cursor: 'pointer', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--pink)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}
                >
                  ✕
                </button>
              </div>
              <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
                <iframe 
                  src="https://drive.google.com/file/d/1Sxm1Jv0PuQ8iLiMM-rYIQj2D51XNtJ80/preview" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none' }}
                  title="Resume Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
