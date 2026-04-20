import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'About',    href: '#about' },
  { label: 'Resume',   href: '#resume' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certs',    href: '#certifications' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23,1,0.32,1] }}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <a href="#hero" className="nav-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="grad-purple">NS</span>
          <span className="logo-bracket">/&gt;</span>
        </a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.label}>
              <a href={l.href} className="nav-link">{l.label}</a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="btn btn-primary nav-cta">Hire Me</a>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={open ? 'bar open' : 'bar'} />
          <span className={open ? 'bar open' : 'bar'} />
          <span className={open ? 'bar open' : 'bar'} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {links.map(l => (
              <a key={l.label} href={l.href} className="mobile-link" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          transition: all 0.4s ease;
        }
        .navbar.scrolled {
          background: rgba(5,5,16,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
          padding: 14px 48px;
        }
        .nav-logo {
          font-family: var(--font-mono); font-size: 20px; font-weight: 700;
          text-decoration: none; color: var(--white); letter-spacing: 2px;
        }
        .logo-bracket { color: var(--purple); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-link {
          font-size: 14px; font-weight: 500; color: var(--gray);
          text-decoration: none; letter-spacing: 0.5px;
          position: relative; transition: color 0.3s;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
          height: 1px; background: var(--purple);
          transform: scaleX(0); transition: transform 0.3s;
        }
        .nav-link:hover { color: var(--white); }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-cta { padding: 10px 24px; font-size: 13px; }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: none; }
        .bar {
          width: 24px; height: 2px; background: var(--white);
          transition: all 0.3s; border-radius: 2px;
        }
        .mobile-menu {
          position: fixed; top: 72px; left: 0; right: 0; z-index: 999;
          background: rgba(5,5,16,0.95); backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
          display: flex; flex-direction: column; padding: 20px;
        }
        .mobile-link {
          padding: 16px 24px; font-size: 18px; color: var(--white);
          text-decoration: none; border-bottom: 1px solid var(--border);
          transition: color 0.3s;
        }
        .mobile-link:hover { color: var(--purple); }
        @media (max-width: 768px) {
          .navbar { padding: 16px 24px; }
          .navbar.scrolled { padding: 12px 24px; }
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>
    </>
  )
}
