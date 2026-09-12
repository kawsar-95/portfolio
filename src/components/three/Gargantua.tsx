/* eslint-disable react-hooks/immutability, react-hooks/purity */
// NOTE: R3F's render loop is intentionally imperative — geometry attributes
// and shader uniforms are generated once and mutated per-frame. The React
// Compiler purity/immutability rules do not apply to this three.js idiom.
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Gargantua — a black hole with a Keplerian accretion disk.          */
/*  Inner particles orbit faster; relativistic beaming makes the       */
/*  approaching side burn brighter. The event horizon occludes the     */
/*  far side of the disk; lensing arcs wrap above and below.           */
/* ------------------------------------------------------------------ */

const DISK_COUNT = 6500;

function AccretionDisk() {
  const { geometry, material } = useMemo(() => {
    const angles = new Float32Array(DISK_COUNT);
    const radii = new Float32Array(DISK_COUNT);
    const sizes = new Float32Array(DISK_COUNT);
    const seeds = new Float32Array(DISK_COUNT);
    const positions = new Float32Array(DISK_COUNT * 3);

    for (let i = 0; i < DISK_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      // density falls off with radius
      radii[i] = 1.85 + Math.pow(Math.random(), 2.1) * 1.9;
      sizes[i] = 0.3 + Math.random() * 0.75;
      seeds[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
    geometry.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aAngle;
        attribute float aRadius;
        attribute float aSize;
        attribute float aSeed;
        uniform float uTime;
        varying float vBright;
        void main() {
          float speed = 0.95 / pow(aRadius, 1.5);
          float angle = aAngle + uTime * speed;
          float r = aRadius + sin(uTime * 0.6 + aSeed * 6.2831) * 0.045;
          vec3 pos = vec3(
            cos(angle) * r,
            (aSeed - 0.5) * 0.13 * (aRadius - 1.75),
            sin(angle) * r
          );
          // relativistic beaming — one side burns brighter, stays fixed in space
          vBright = 0.25 + 1.4 * max(0.0, cos(angle - 0.7));
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (58.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vBright;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.04, d);
          vec3 amber = vec3(0.96, 0.60, 0.20);
          vec3 white = vec3(1.0, 0.96, 0.88);
          vec3 col = mix(amber, white, clamp(vBright - 0.9, 0.0, 1.0));
          gl_FragColor = vec4(col * vBright, alpha * 0.55);
        }
      `,
    });

    return { geometry, material };
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <points geometry={geometry} material={material} renderOrder={1} />;
}

function glowTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 190, 100, 0.55)");
  g.addColorStop(0.35, "rgba(232, 163, 61, 0.18)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function Hole() {
  const glow = useMemo(() => glowTexture(), []);
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = Math.sin(t * 0.08) * 0.04;
    group.current.rotation.y += (pointer.x * 0.12 - group.current.rotation.y) * 0.03;
  });

  return (
    <group ref={group} rotation={[1.18, 0, 0]}>
      {/* ambient glow */}
      <sprite scale={[11, 11, 1]} position={[0, 0, -0.5]} renderOrder={0}>
        <spriteMaterial map={glow} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.5} />
      </sprite>

      {/* event horizon — swallows the far side of the disk */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* photon ring */}
      <mesh renderOrder={2}>
        <torusGeometry args={[1.56, 0.014, 12, 220]} />
        <meshBasicMaterial color="#fff4e0" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* lensing arcs — the disk wrapped over and under by gravity */}
      <mesh renderOrder={2} position={[0, 0.1, 0]}>
        <torusGeometry args={[1.78, 0.05, 10, 160, Math.PI * 0.72]} />
        <meshBasicMaterial color="#ffc470" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh renderOrder={2} position={[0, -0.1, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[1.78, 0.045, 10, 160, Math.PI * 0.72]} />
        <meshBasicMaterial color="#e8a33d" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* accretion disk lives in the same tilted frame */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <AccretionDisk />
      </group>
    </group>
  );
}

export default function Gargantua() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 8.6], fov: 44 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Hole />
    </Canvas>
  );
}
