"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const positionArray = new Float32Array(260 * 3);
    const colorArray = new Float32Array(260 * 3);
    const violet = new THREE.Color("#a875ff");
    const pearl = new THREE.Color("#f0eaff");
    for (let index = 0; index < 260; index += 1) {
      const radius = 2.8 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      positionArray[index * 3] = Math.cos(angle) * radius * (0.65 + Math.random() * .35);
      positionArray[index * 3 + 1] = (Math.random() - .5) * 3.5;
      positionArray[index * 3 + 2] = Math.sin(angle) * radius;
      const color = index % 4 === 0 ? pearl : violet;
      colorArray[index * 3] = color.r;
      colorArray[index * 3 + 1] = color.g;
      colorArray[index * 3 + 2] = color.b;
    }
    return [positionArray, colorArray];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.getElapsedTime() * .04 + pointer.x * .08;
    points.current.rotation.x = pointer.y * .05;
  });

  return <points ref={points} position={[.4, 0, -1]}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} /><bufferAttribute attach="attributes-color" args={[colors, 3]} count={colors.length / 3} /></bufferGeometry><pointsMaterial size={.027} vertexColors transparent opacity={.72} sizeAttenuation /></points>;
}

function Orb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.getElapsedTime() * .08 + pointer.y * .12;
    mesh.current.rotation.y = clock.getElapsedTime() * .12 + pointer.x * .18;
  });
  return <mesh ref={mesh} position={[.4, 0, -1.2]}><icosahedronGeometry args={[1.65, 5]} /><meshPhysicalMaterial color="#7e4ef0" emissive="#321760" emissiveIntensity={.55} roughness={.2} metalness={.25} transmission={.5} thickness={1.6} transparent opacity={.58} /></mesh>;
}

export function AuraScene() {
  return <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}><ambientLight intensity={.5} /><pointLight position={[2, 2, 4]} color="#c6a8ff" intensity={10} distance={8} /><pointLight position={[-3, -2, 2]} color="#7136d1" intensity={8} distance={7} /><Orb /><ParticleField /></Canvas>;
}
