import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 4000 }) {
  const mesh = useRef()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      [0.608, 0.365, 0.898], // purple
      [0.000, 0.706, 0.847], // blue
      [0.945, 0.357, 0.714], // pink
      [0.000, 0.961, 1.000], // cyan
    ]
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i*3]   = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2]
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.04
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
