"use client";

import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";

export type SceneKind = "sofa" | "armchair" | "chair" | "table" | "bed" | "coffee-table";

function Box({
  args,
  position,
  color,
  radius = 0.04,
}: {
  args: [number, number, number];
  position: [number, number, number];
  color: string;
  radius?: number;
}) {
  return (
    <RoundedBox
      args={args}
      position={position}
      radius={radius}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} />
    </RoundedBox>
  );
}

function Legs({
  xs,
  zs,
  h,
  color,
  y = 0,
}: {
  xs: number[];
  zs: number[];
  h: number;
  color: string;
  y?: number;
}) {
  return (
    <>
      {xs.flatMap((x) =>
        zs.map((z) => (
          <mesh key={`${x}-${z}`} position={[x, y + h / 2, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.025, h, 12]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        )),
      )}
    </>
  );
}

const WOOD = "#6b4a32";

/** Procedural low-poly furniture so the 3D view works without external model files. */
function Model({ kind, color }: { kind: SceneKind; color: string }) {
  switch (kind) {
    case "armchair":
      return (
        <group>
          <Legs xs={[-0.38, 0.38]} zs={[-0.3, 0.3]} h={0.18} color={WOOD} />
          <Box args={[0.9, 0.22, 0.8]} position={[0, 0.3, 0]} color={color} />
          <Box args={[0.62, 0.12, 0.62]} position={[0, 0.46, 0.04]} color={color} radius={0.06} />
          <Box args={[0.9, 0.7, 0.16]} position={[0, 0.66, -0.34]} color={color} radius={0.07} />
          <Box args={[0.16, 0.38, 0.8]} position={[-0.42, 0.5, 0]} color={color} radius={0.07} />
          <Box args={[0.16, 0.38, 0.8]} position={[0.42, 0.5, 0]} color={color} radius={0.07} />
        </group>
      );
    case "chair":
      return (
        <group>
          <Legs xs={[-0.2, 0.2]} zs={[-0.2, 0.2]} h={0.45} color={WOOD} />
          <Box args={[0.5, 0.06, 0.5]} position={[0, 0.48, 0]} color={color} />
          <Box args={[0.5, 0.5, 0.05]} position={[0, 0.78, -0.23]} color={color} />
        </group>
      );
    case "table":
      return (
        <group>
          <Legs xs={[-0.7, 0.7]} zs={[-0.35, 0.35]} h={0.72} color={WOOD} />
          <Box args={[1.7, 0.06, 0.9]} position={[0, 0.75, 0]} color={color} radius={0.02} />
        </group>
      );
    case "coffee-table":
      return (
        <group>
          <Legs xs={[-0.4, 0.4]} zs={[-0.25, 0.25]} h={0.38} color={WOOD} />
          <mesh position={[0, 0.41, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.05, 48]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        </group>
      );
    case "bed":
      return (
        <group>
          <Legs xs={[-0.85, 0.85]} zs={[-0.95, 0.95]} h={0.12} color={WOOD} />
          <Box args={[1.85, 0.3, 2.05]} position={[0, 0.27, 0]} color={color} />
          <Box args={[1.75, 0.18, 1.95]} position={[0, 0.5, 0.02]} color="#f3f0ea" radius={0.06} />
          <Box args={[1.85, 0.95, 0.12]} position={[0, 0.6, -1.02]} color={color} radius={0.06} />
          <Box
            args={[0.6, 0.12, 0.35]}
            position={[-0.45, 0.65, -0.72]}
            color="#e6e1d8"
            radius={0.05}
          />
          <Box
            args={[0.6, 0.12, 0.35]}
            position={[0.45, 0.65, -0.72]}
            color="#e6e1d8"
            radius={0.05}
          />
        </group>
      );
    default:
      return (
        <group>
          <Legs xs={[-0.95, 0.95]} zs={[-0.32, 0.32]} h={0.14} color={WOOD} />
          <Box args={[2.1, 0.24, 0.9]} position={[0, 0.26, 0]} color={color} />
          {[-0.62, 0, 0.62].map((x) => (
            <Box
              key={x}
              args={[0.6, 0.14, 0.66]}
              position={[x, 0.45, 0.06]}
              color={color}
              radius={0.06}
            />
          ))}
          <Box args={[2.1, 0.55, 0.2]} position={[0, 0.6, -0.36]} color={color} radius={0.08} />
          <Box args={[0.2, 0.42, 0.9]} position={[-1.0, 0.48, 0]} color={color} radius={0.08} />
          <Box args={[0.2, 0.42, 0.9]} position={[1.0, 0.48, 0]} color={color} radius={0.08} />
        </group>
      );
  }
}

function Turntable({ children, spin }: { children: ReactNode; spin: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spin && ref.current) ref.current.rotation.y += dt * 0.35;
  });
  return <group ref={ref}>{children}</group>;
}

export default function FurnitureScene({
  kind,
  color,
  autoRotate,
  interactive = true,
}: {
  kind: SceneKind;
  color: string;
  autoRotate: boolean;
  interactive?: boolean;
}) {
  const distance = kind === "bed" || kind === "table" || kind === "sofa" ? 3.6 : 2.4;
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [distance * 0.75, distance * 0.55, distance], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#fff8f0", "#d8cfc4", 1.1]} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} />
      <Turntable spin={autoRotate && !interactive}>
        <group position={[0, -0.35, 0]}>
          <Model kind={kind} color={color} />
        </group>
      </Turntable>
      <ContactShadows position={[0, -0.35, 0]} opacity={0.35} scale={6} blur={2.2} far={2} />
      {interactive ? (
        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={6}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.05}
        />
      ) : null}
    </Canvas>
  );
}
