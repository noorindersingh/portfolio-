import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const socials = [
  { icon: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/noorinder-singh-678a08372', color: '#0077B5' },
  { icon: '🐙', label: 'GitHub',   href: 'https://github.com/noorindersingh',                   color: '#9B5DE5' },
  { icon: '✉️', label: 'Email',    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=noorindersingh81@gmail.com', color: '#F15BB5' },
]

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [focused, setFocused] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact — ${form.name}`)
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=noorindersingh81@gmail.com&su=${subject}&body=${body}`
    window.open(gmailUrl, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact">
      <div className="reveal">
        <span className="section-tag">Let's Talk</span>
        <h2 className="section-title">Get In <span className="grad-purple">Touch</span></h2>
        <p className="section-subtitle">Have a project in mind or just want to say hi? I'd love to hear from you.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }} className="contact-grid">
        {/* Left panel */}
        <div className="reveal-left" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass" style={{ padding: 36 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Noorinder Singh</h3>
            <p style={{ color: 'var(--purple)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: 20 }}>AI Developer & Designer</p>
            <p style={{ color: 'var(--gray)', lineHeight: 1.7, marginBottom: 28 }}>
              Open to freelance projects, collaborations, and full-time opportunities. Let's build something amazing together.
            </p>

            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0',
                  borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'var(--white)',
                  transition: 'all 0.3s', cursor: 'none'
                }}
                onMouseEnter={e => e.currentTarget.style.color = s.color}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--white)'}
              >
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span style={{ fontWeight: 500 }}>{s.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--gray)', fontSize: '0.85rem' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="reveal-right">
          <form onSubmit={submit} className="glass" style={{ padding: 40 }}>
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, color: 'var(--cyan)', fontSize: '0.9rem' }}
                >
                  ✓ Gmail opened in new tab! Message ready to send.
                </motion.div>
              )}
            </AnimatePresence>

            {[
              { id: 'name',    label: 'Your Name',    type: 'text',  placeholder: 'Noorinder Singh' },
              { id: 'email',   label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
            ].map(f => (
              <div key={f.id} style={{ marginBottom: 20 }}>
                <label htmlFor={f.id} style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                  {f.label}
                </label>
                <input
                  id={f.id} type={f.type} required
                  placeholder={f.placeholder}
                  value={form[f.id]}
                  onChange={e => setForm({...form, [f.id]: e.target.value})}
                  onFocus={() => setFocused(f.id)}
                  onBlur={() => setFocused('')}
                  autoComplete="off"
                  data-lpignore="true"
                  data-dashlane-ignore="true"
                  style={{
                    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused === f.id ? 'var(--purple)' : 'var(--border)'}`,
                    borderRadius: 12, color: 'var(--white)', fontSize: '0.95rem',
                    fontFamily: 'var(--font-main)', outline: 'none',
                    boxShadow: focused === f.id ? 'var(--glow-purple)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <label htmlFor="message" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                Message
              </label>
              <textarea
                id="message" required rows={5}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused('')}
                style={{
                  width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${focused === 'message' ? 'var(--purple)' : 'var(--border)'}`,
                  borderRadius: 12, color: 'var(--white)', fontSize: '0.95rem',
                  fontFamily: 'var(--font-main)', outline: 'none', resize: 'vertical',
                  boxShadow: focused === 'message' ? 'var(--glow-purple)' : 'none',
                  transition: 'all 0.3s'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px 32px' }}>
              Send Message ✉️
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @media(max-width:900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        
        /* Override Chrome/Browser autofill background color */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #13132B inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
            caret-color: white;
        }
      `}</style>
    </section>
  )
}
