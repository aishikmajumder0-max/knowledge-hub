"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";

function LearningObject() {
  return <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.5}>
    <mesh rotation={[0.3, 0.4, 0.1]} castShadow>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshStandardMaterial color="#8b5cf6" metalness={0.55} roughness={0.22} />
    </mesh>
    <mesh rotation={[0.3, 0.4, 0.1]} scale={1.18}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshBasicMaterial color="#a5f3fc" wireframe transparent opacity={0.32} />
    </mesh>
  </Float>;
}
export function Box() {
  return <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.6]}>
    <color attach="background" args={["#101528"]}/>
    <ambientLight intensity={1.4}/>
    <directionalLight position={[3, 4, 5]} intensity={3} />
    <pointLight position={[-3, -2, -3]} color="#22d3ee" intensity={30}/>
    <LearningObject/>
    <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
    <Environment preset="city"/>
  </Canvas>;
}
