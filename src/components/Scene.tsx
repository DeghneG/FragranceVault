"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Trail, Sparkles, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function SmokeRibbon({ color, width, length, speed, offset, invert = false }: {
  color: string;
  width: number;
  length: number;
  speed: number;
  offset: number;
  invert?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * speed) + offset;
    if (ref.current) {
      // Create an elegant, sweeping organic motion
      const x = Math.sin(t) * 2.5;
      const y = Math.sin(t * 0.8) * 2.5;
      const z = Math.cos(t * 1.2) * 2.5;

      ref.current.position.set(invert ? -x : x, invert ? -y : y, z);
    }
  });

  return (
    <Trail
      width={width}
      length={length}
      color={new THREE.Color(color)}
      attenuation={(t) => t * t} // Smoothly tapers the end of the smoke trail
    >
      <group ref={ref}>
        {/* Invisible point leading the trail */}
        <mesh visible={false}>
          <sphereGeometry args={[0.1]} />
        </mesh>
      </group>
    </Trail>
  );
}

export default function Scene() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <group rotation={[0.2, 0.5, 0]}>
            {/* Main thick amber ribbon representing the core scent */}
            <SmokeRibbon color="#C4A47C" width={3} length={12} speed={0.4} offset={0} />
            
            {/* Secondary thin green ribbon representing a specific note (like vetiver) */}
            <SmokeRibbon color="#4A5D4E" width={1} length={16} speed={0.5} offset={2} invert />
            
            {/* Tertiary bright highlight thread */}
            <SmokeRibbon color="#E8E6E1" width={0.2} length={20} speed={0.6} offset={5} />
            
            {/* Fine mist/sillage particles hanging in the air */}
            <Sparkles 
              count={80} 
              scale={6} 
              size={1} 
              speed={0.2} 
              opacity={0.3} 
              color="#C4A47C" 
            />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
