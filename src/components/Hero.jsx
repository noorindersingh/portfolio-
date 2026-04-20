import React, { useRef, useEffect, useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

const Spline = lazy(() => import('@splinetool/react-spline'))

const words = ['AI Developer', 'UI/UX Designer', 'Problem Solver', 'Innovator']

export default function Hero({ isMobile }) {
  const mouse  = useRef({ x: 0, y: 0 })
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Mouse tracking for 3D parallax
  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Typewriter
  useEffect(() => {
    const word = words[wordIdx]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setWordIdx((wordIdx + 1) % words.length)
      }, 0)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIdx])

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
  const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.23,1,0.32,1] } } }

  return (
    <div id="hero" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Spline 3D Canvas - Lazy Loaded (Hidden on Mobile for Performance) */}
      {!isMobile && (
        <div 
          onWheelCapture={(e) => e.stopPropagation()}
          style={{ position: 'absolute', right: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
        >
          <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span></div>}>
            <Spline scene="https://prod.spline.design/wDTzjsxPhAVNxCzT/scene.splinecode" />
          </Suspense>
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 60% 80% at 60% 50%, transparent 0%, rgba(5,5,16,0.6) 70%, rgba(5,5,16,0.95) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        style={{ position: 'relative', zIndex: 2, padding: '0 48px', maxWidth: 720 }}
      >
        <motion.div variants={item}>
          <span className="section-tag" style={{ marginBottom: 24 }}>🚀 Available for opportunities</span>
        </motion.div>

        <motion.h1 variants={item} style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 900, lineHeight: 1.05,
          marginBottom: 12, fontFamily: 'var(--font-main)',
          color: 'var(--white)'
        }}>
          Noorinder<br />
          <span className="grad-purple">Singh</span>
        </motion.h1>

        <motion.div variants={item} style={{ marginBottom: 24, height: 48, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: 'var(--gray)', fontFamily: 'var(--font-alt)' }}>
            I am a{' '}
          </span>
          <span style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700,
            fontFamily: 'var(--font-alt)', color: 'var(--cyan)',
            textShadow: '0 0 20px rgba(0,245,255,0.5)'
          }}>
            {displayed}<span style={{ borderRight: '2px solid var(--cyan)', marginLeft: 2, animation: 'blink 1s step-end infinite' }} />
          </span>
        </motion.div>

        <motion.p variants={item} style={{ fontSize: '1.1rem', color: 'var(--gray)', lineHeight: 1.7, marginBottom: 40, maxWidth: 540 }}>
          Turning ideas into smart, scalable digital products. Building AI-powered experiences that push boundaries.
        </motion.p>

        <motion.div variants={item} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="#contact"  className="btn btn-outline">Get In Touch</a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={item}
          style={{ position: 'absolute', bottom: -180, left: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.5 }}
        >
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--gray)' }}>Scroll</span>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, var(--purple), transparent)' }} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media(max-width:600px){ [style*="padding: 0 48px"]{padding:0 20px !important} }
      `}</style>
    </div>
  )
}
