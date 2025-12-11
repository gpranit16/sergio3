'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Robot Head Component
function RobotHead({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const headRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (headRef.current) {
      // Smooth rotation towards mouse
      targetRotation.current.x = mousePosition.y * 0.3;
      targetRotation.current.y = mousePosition.x * 0.4;

      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetRotation.current.x,
        0.08
      );
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetRotation.current.y,
        0.08
      );

      // Subtle idle animation
      headRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.4, 0]}>
      {/* Main helmet/head - spherical with flattened front */}
      <mesh castShadow>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Helmet rim - top */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.65, 0.12, 16, 64]} />
        <meshStandardMaterial
          color="#0d0d0d"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Left ear piece */}
      <mesh position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.25, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Left ear glow */}
      <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.16, 0.12, 32]} />
        <meshStandardMaterial
          color="#ff6b4a"
          emissive="#ff6b4a"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Right ear piece */}
      <mesh position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.25, 0.25, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Right ear glow */}
      <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.16, 0.12, 32]} />
        <meshStandardMaterial
          color="#ff6b4a"
          emissive="#ff6b4a"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Face visor/screen area */}
      <mesh position={[0, 0, 0.45]}>
        <sphereGeometry args={[0.72, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Left eye - curved arc */}
      <group position={[-0.28, 0.12, 0.7]}>
        <mesh rotation={[0, 0, 0.3]}>
          <torusGeometry args={[0.15, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Right eye - curved arc */}
      <group position={[0.28, 0.12, 0.7]}>
        <mesh rotation={[0, 0, -0.3]}>
          <torusGeometry args={[0.15, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Smile - curved arc at bottom */}
      <mesh position={[0, -0.18, 0.75]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.2, 0.035, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Robot Body Component
function RobotBody({ isGreeting }: { isGreeting: boolean }) {
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      // Gentle floating motion
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }

    // Greeting wave animation for right arm
    if (rightArmRef.current) {
      if (isGreeting) {
        rightArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.3 - 1.2;
        rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 4) * 0.2;
      } else {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0.3,
          0.05
        );
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          0,
          0.05
        );
      }
    }

    // Subtle movement for left arm
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1 - 0.3;
    }
  });

  return (
    <group ref={bodyRef} position={[0, 0.1, 0]}>
      {/* Main torso */}
      <mesh castShadow>
        <capsuleGeometry args={[0.45, 0.7, 16, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Chest circle - glowing ring */}
      <mesh position={[0, 0.15, 0.42]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#ff6b4a"
          emissive="#ff6b4a"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Chest inner circle */}
      <mesh position={[0, 0.15, 0.40]}>
        <circleGeometry args={[0.14, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.55, 0.25, 0]}>
        {/* Shoulder */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Upper arm */}
        <mesh position={[-0.12, -0.18, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.22, -0.40, 0]}>
          <sphereGeometry args={[0.10, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Right arm - waving */}
      <group ref={rightArmRef} position={[0.55, 0.25, 0]}>
        {/* Shoulder */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Upper arm */}
        <mesh position={[0.12, -0.18, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Hand */}
        <mesh position={[0.22, -0.40, 0]}>
          <sphereGeometry args={[0.10, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Left leg */}
      <group position={[-0.20, -0.65, 0]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.28, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.28, 0.04]}>
          <sphereGeometry args={[0.10, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.20, -0.65, 0]}>
        <mesh>
          <capsuleGeometry args={[0.09, 0.28, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.28, 0.04]}>
          <sphereGeometry args={[0.10, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

// Complete Robot Scene
function RobotScene({ mousePosition, isGreeting }: { mousePosition: { x: number; y: number }; isGreeting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation for the whole robot
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      {/* Position the robot group much lower and scale smaller to show full body */}
      <group ref={groupRef} scale={0.65} position={[0, -1.2, 0]}>
        <RobotHead mousePosition={mousePosition} />
        <RobotBody isGreeting={isGreeting} />
        
        {/* Ambient glow behind robot */}
        <mesh position={[0, 0, -1.5]} scale={5}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial
            color="#ff6b4a"
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#ff6b4a" wireframe />
    </mesh>
  );
}

// Main exported component
export default function Robot3D({ isTyping = false }: { isTyping?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGreeting, setIsGreeting] = useState(true);

  useEffect(() => {
    // End greeting after 4 seconds
    const timer = setTimeout(() => setIsGreeting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Normalize mouse position relative to container center
        const x = (event.clientX - centerX) / (rect.width / 2);
        const y = -(event.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({
          x: Math.max(-1, Math.min(1, x)),
          y: Math.max(-1, Math.min(1, y))
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 3, 5]} intensity={0.5} color="#ff6b4a" />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#ffffff" />
          <pointLight position={[0, 0, -2]} intensity={0.3} color="#ff6b4a" />
          
          <RobotScene mousePosition={mousePosition} isGreeting={isGreeting || isTyping} />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
