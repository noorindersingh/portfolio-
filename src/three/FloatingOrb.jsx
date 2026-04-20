import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'

export default function FloatingOrb() {
  const mesh  = useRef()
  const mesh2 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.2
      mesh.current.rotation.y = t * 0.3
      mesh.current.position.y = Math.sin(t * 0.8) * 0.25
    }
    if (mesh2.current) {
      mesh2.current.rotation.x = -t * 0.15
      mesh2.current.rotation.y = -t * 0.2
    }
  })

  return (
    <group>
      {/* Core orb */}
      <Sphere ref={mesh} args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          color="#6020c0"
          attach="material"
          distort={0.45}
          speed={2.5}
          roughness={0.1}
          metalness={0.8}
          emissive="#2a0060"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Outer glow shell */}
      <Sphere ref={mesh2} args={[1.85, 64, 64]}>
        <meshStandardMaterial
          color="#9B5DE5"
          transparent
          opacity={0.08}
          wireframe={false}
          side={2}
        />
      </Sphere>

      {/* Orbit rings */}
      {[0, 55, 110].map((deg, i) => (
        <Ring key={i} rotX={deg} rotZ={i * 30} color={['#9B5DE5','#00B4D8','#F15BB5'][i]} />
      ))}

      {/* Core point light */}
      <pointLight color="#9B5DE5" intensity={3} distance={8} />
    </group>
  )
}

function Ring({ rotX, rotZ, color }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.005
    }
  })
  return (
    <mesh
      ref={ref}
      rotation={[rotX * Math.PI/180, 0, rotZ * Math.PI/180]}
    >
      <torusGeometry args={[2.6, 0.012, 16, 200]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} />
    </mesh>
  )
}
