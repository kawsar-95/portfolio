/* eslint-disable react-hooks/immutability */
// NOTE: R3F's render loop is intentionally imperative — BufferGeometry
// attributes are mutated per-frame inside useFrame. The React Compiler
// immutability rule does not apply to this three.js idiom.
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  True 4D hypercube: 16 vertices, 32 edges, rotated in the XW / YZ   */
/*  planes and perspective-projected from 4-space into 3-space.        */
/* ------------------------------------------------------------------ */

/** Soft circular sprite for vertex nodes (raw GL points are square). */
let nodeTex: THREE.Texture | null = null;
function nodeTexture(): THREE.Texture {
  if (nodeTex) return nodeTex;
  const s = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  nodeTex = new THREE.CanvasTexture(canvas);
  return nodeTex;
}

const VERTS_4D: number[][] = [];
for (let i = 0; i < 16; i++) {
  VERTS_4D.push([
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
    i & 8 ? 1 : -1,
  ]);
}

const EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) if (VERTS_4D[i][k] !== VERTS_4D[j][k]) diff++;
    if (diff === 1) EDGES.push([i, j]);
  }
}

function rotate4D(v: number[], aXW: number, aYW: number, aZW: number): number[] {
  let [x, y, z, w] = v;
  // XW plane
  let c = Math.cos(aXW), s = Math.sin(aXW);
  [x, w] = [x * c - w * s, x * s + w * c];
  // YW plane
  c = Math.cos(aYW); s = Math.sin(aYW);
  [y, w] = [y * c - w * s, y * s + w * c];
  // ZW plane
  c = Math.cos(aZW); s = Math.sin(aZW);
  [z, w] = [z * c - w * s, z * s + w * c];
  return [x, y, z, w];
}

function project(v4: number[], d: number): [number, number, number] {
  const scale = d / (d - v4[3]);
  return [v4[0] * scale, v4[1] * scale, v4[2] * scale];
}

function Hypercube({
  scale,
  color,
  opacity,
  speed,
  offset,
}: {
  scale: number;
  color: string;
  opacity: number;
  speed: number;
  offset: number;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const nodeRef = useRef<THREE.Points>(null);

  const { lineGeo, pointGeo } = useMemo(() => {
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(EDGES.length * 6), 3)
    );
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(16 * 3), 3)
    );
    return { lineGeo, pointGeo };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const d = 3.2;
    const projected = VERTS_4D.map((v) => {
      const r = rotate4D(v, t * 0.7, t * 0.43, t * 0.28);
      const p = project(r, d);
      // gentle 3D tumble
      const cx = Math.cos(t * 0.18), sx = Math.sin(t * 0.18);
      const y = p[1] * cx - p[2] * sx;
      const z = p[1] * sx + p[2] * cx;
      return [p[0] * scale, y * scale, z * scale];
    });

    const lp = lineGeo.attributes.position.array as Float32Array;
    EDGES.forEach(([a, b], i) => {
      lp[i * 6] = projected[a][0];
      lp[i * 6 + 1] = projected[a][1];
      lp[i * 6 + 2] = projected[a][2];
      lp[i * 6 + 3] = projected[b][0];
      lp[i * 6 + 4] = projected[b][1];
      lp[i * 6 + 5] = projected[b][2];
    });
    lineGeo.attributes.position.needsUpdate = true;

    const pp = pointGeo.attributes.position.array as Float32Array;
    projected.forEach((p, i) => {
      pp[i * 3] = p[0];
      pp[i * 3 + 1] = p[1];
      pp[i * 3 + 2] = p[2];
    });
    pointGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={nodeRef} geometry={pointGeo}>
        <pointsMaterial
          color={color}
          map={nodeTexture()}
          alphaTest={0.01}
          size={0.075 * scale}
          sizeAttenuation
          transparent
          opacity={Math.min(1, opacity + 0.35)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ pointer }) => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.x * 0.28 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-pointer.y * 0.22 - group.current.rotation.x) * 0.04;
  });
  return <group ref={group}>{children}</group>;
}

export default function Tesseract() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Stars radius={60} depth={40} count={2600} factor={3.2} saturation={0} fade speed={0.6} />
      <Rig>
        {/* outer cage — pale, slow, immense */}
        <Hypercube scale={2.9} color="#e8e6e1" opacity={0.13} speed={0.16} offset={0} />
        {/* inner core — amber, alive */}
        <Hypercube scale={1.7} color="#e8a33d" opacity={0.55} speed={0.34} offset={2.1} />
      </Rig>
    </Canvas>
  );
}
