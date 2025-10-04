"use client"

import { useRef, Suspense, useEffect } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { OrbitControls, Sphere, useTexture } from "@react-three/drei"
import * as THREE from "three"

interface EarthProps {
  onLoaded?: () => void
}

function Earth({ onLoaded }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  
  // Load the earth texture using useTexture from drei (better for performance)
  const earthTexture = useTexture("/earth.jpg")

  useEffect(() => {
    if (earthTexture && onLoaded) {
      onLoaded()
    }
  }, [earthTexture, onLoaded])

  return (
    <group position={[0, 0, 0]}>
      <Sphere ref={earthRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          emissive="#1e3a8a"
          emissiveIntensity={0.1}
          roughness={0.5}
          metalness={0.25}
        />
      </Sphere>
    </group>
  )
}

export function Earth3D({ onLoaded }: { onLoaded?: () => void }) {
  return (
    <div className="w-[1500px] h-[1500px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#4299e1" />

        {/* Earth with Suspense - no loading screen */}
        <Suspense fallback={null}>
          <Earth onLoaded={onLoaded} />
        </Suspense>

        {/* Controls for interaction - with auto-rotate enabled */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minDistance={5}
          maxDistance={12}
          autoRotate={true}
          autoRotateSpeed={1.0}
          rotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
          target={[0, 0, 0]}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
