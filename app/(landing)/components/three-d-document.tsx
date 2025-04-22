'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Environment, PresentationControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

function DocumentModel({ ...props }) {
  const group = useRef<Group>(null);

  // Since we don't have a specific document model, we'll create a simple document representation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Main document */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 7, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Document content */}
      <Html
        transform
        position={[0, 0, 0.11]}
        rotation={[0, 0, 0]}
        scale={[0.048, 0.048, 0.048]}
      >
        <div className="w-[100px] h-[140px] bg-white p-1 overflow-hidden">
          <div className="w-full h-3 bg-[#634AFF] mb-2 rounded-sm"></div>
          <div className="w-3/4 h-2 bg-gray-300 mb-1 rounded-sm"></div>
          <div className="w-1/2 h-2 bg-gray-300 mb-2 rounded-sm"></div>
          <div className="w-full h-1 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="w-full h-1 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="w-full h-1 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="w-3/4 h-1 bg-gray-200 mb-2 rounded-sm"></div>
          <div className="w-1/2 h-4 bg-[#634AFF]/20 mb-2 rounded-sm"></div>
          <div className="w-full h-1 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="w-full h-1 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="w-3/4 h-1 bg-gray-200 mb-1 rounded-sm"></div>
        </div>
      </Html>

      {/* Floating documents */}
      <mesh position={[-2, 1, -1]} rotation={[0.1, 0.2, 0.1]} castShadow>
        <boxGeometry args={[4, 5.5, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      <mesh position={[2, -1, -1.5]} rotation={[-0.1, -0.3, 0]} castShadow>
        <boxGeometry args={[3.5, 5, 0.1]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Cursor */}
      <mesh position={[1, 0.5, 0.15]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#634AFF" />
      </mesh>
    </group>
  );
}

export default function ThreeDDocument() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg animate-pulse"></div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[500px] rounded-lg overflow-hidden"
    >
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <DocumentModel position={[0, 0, 0]} />
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </motion.div>
  );
}
