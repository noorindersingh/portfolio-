import { useEffect, useState } from 'react'
import Lenis           from 'lenis'
import Cursor          from './components/Cursor'
import Navbar          from './components/Navbar'
import Hero            from './components/Hero'
import About           from './components/About'
import Resume          from './components/Resume'
import Skills          from './components/Skills'
import Projects        from './components/Projects'
import Certifications  from './components/Certifications'
import Experience      from './components/Experience'
import Contact         from './components/Contact'
import Footer          from './components/Footer'
import LiquidEther     from './components/LiquidEther'
import useScrollReveal from './hooks/useScrollReveal'

export default function App() {
  useScrollReveal()
  const [isMobile, setIsMobile] = useState(false)

  // Initialize Lenis Smooth Scrolling & Mobile Detection
  useEffect(() => {
    // Mobile Check
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
    })
    
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.9) el.classList.add('visible')
      })
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Fixed full-screen LiquidEther background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: '#050510',
        pointerEvents: 'none',
      }}>
        <LiquidEther
          colors={['#9B5DE5', '#00B4D8', '#F15BB5', '#050510']}
          mouseForce={isMobile ? 10 : 22}
          cursorSize={isMobile ? 60 : 120}
          resolution={isMobile ? 0.2 : 0.5}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={2.5}
          autoResumeDelay={2000}
          autoRampDuration={0.8}
          takeoverDuration={0.3}
          iterationsPoisson={isMobile ? 16 : 32}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        />
      </div>

      {/* Dark overlay so text stays readable */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'rgba(5, 5, 16, 0.55)',
        pointerEvents: 'none',
      }} />

      <Cursor />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero isMobile={isMobile} />
        <About />
        <Resume />
        <Skills />
        <Projects />
        <Certifications />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
