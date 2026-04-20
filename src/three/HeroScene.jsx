import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import FloatingOrb from './FloatingOrb'
import ParticleField from './ParticleField'

function CameraRig({ mouse }) {
  const { camera } = useThree()
  useFrame(() => {
    // eslint-disable-next-line react-hooks/immutability
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.05
    camera.position.y += (mouse.current.y * 1.0 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#9B5DE5" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#00B4D8" />

      <Suspense fallback={null}>
        <ParticleField count={3500} />
        <FloatingOrb />
      </Suspense>

      <CameraRig mouse={mouse} />
    </Canvas>
  )
}
