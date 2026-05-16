"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeLeafShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, -2.5);
  s.bezierCurveTo(0.4, -2.2, 2.3, -0.3, 1.9, 1.5);
  s.bezierCurveTo(1.5, 2.8, 0.4, 3.3, 0, 3.3);
  s.bezierCurveTo(-0.4, 3.3, -1.5, 2.8, -1.9, 1.5);
  s.bezierCurveTo(-2.3, -0.3, -0.4, -2.2, 0, -2.5);
  return s;
}

// Build a realistic leaf group: semi-transparent fill + outline + center vein + lateral veins
function buildRealisticLeaf(
  col: THREE.Color,
  outlineOpacity: number,
  fillOpacity: number,
  geos: THREE.BufferGeometry[],
  mats: THREE.Material[]
): THREE.Group {
  const group = new THREE.Group();
  const shape = makeLeafShape();

  // ── Filled face ──
  const fillGeo = new THREE.ShapeGeometry(shape, 48);
  const fillMat = new THREE.MeshBasicMaterial({
    color: col,
    transparent: true,
    opacity: fillOpacity,
    side: THREE.DoubleSide,
  });
  geos.push(fillGeo); mats.push(fillMat);
  group.add(new THREE.Mesh(fillGeo, fillMat));

  // ── Sharp outline (edges of triangulated mesh) ──
  const edgesGeo = new THREE.EdgesGeometry(fillGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: outlineOpacity });
  geos.push(edgesGeo); mats.push(edgesMat);
  group.add(new THREE.LineSegments(edgesGeo, edgesMat));

  // ── Centre vein — slight S-curve from tip to tip ──
  const veinPts: number[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = -2.5 + t * 5.8;
    const x = Math.sin(t * Math.PI) * 0.08; // gentle S
    veinPts.push(x, y, 0.02);
  }
  const veinGeo = new THREE.BufferGeometry();
  veinGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(veinPts), 3));
  const veinMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: outlineOpacity * 0.9 });
  geos.push(veinGeo); mats.push(veinMat);
  group.add(new THREE.Line(veinGeo, veinMat));

  // ── Lateral veins — branching pairs ──
  const lateral: { y: number; xMax: number }[] = [
    { y: -1.0, xMax: 1.0 },
    { y: -0.1, xMax: 1.65 },
    { y:  0.8, xMax: 1.80 },
    { y:  1.6, xMax: 1.45 },
    { y:  2.3, xMax: 0.95 },
  ];
  const latPts: number[] = [];
  lateral.forEach(({ y, xMax }) => {
    const xOrig = Math.sin(((y + 2.5) / 5.8) * Math.PI) * 0.08;
    // right branch
    latPts.push(xOrig, y, 0.02, xMax, y + 0.55, 0.02);
    // left branch
    latPts.push(xOrig, y, 0.02, -xMax, y + 0.55, 0.02);
  });
  const latGeo = new THREE.BufferGeometry();
  latGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(latPts), 3));
  const latMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: outlineOpacity * 0.55 });
  geos.push(latGeo); mats.push(latMat);
  group.add(new THREE.LineSegments(latGeo, latMat));

  return group;
}

// ── ThreeLeafScene — dark hero ────────────────────────────────────────────────
export function ThreeLeafScene({
  accent = "#6BBF3E",
  count = 900,
}: {
  accent?: string;
  count?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "0";
    mount.appendChild(renderer.domElement);

    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];
    const col = new THREE.Color(accent);

    // ── Particle field ──
    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pPos[i] = (Math.random() - 0.5) * 22;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: col, size: 0.02, transparent: true, opacity: 0.3 });
    geos.push(pGeo); mats.push(pMat);
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Main realistic leaf (large, right side) ──
    const mainLeaf = buildRealisticLeaf(col, 0.45, 0.12, geos, mats);
    mainLeaf.scale.setScalar(0.9);
    mainLeaf.position.set(2.8, 0.2, -0.5);
    mainLeaf.rotation.z = 0.3;
    scene.add(mainLeaf);

    // ── Ghost outline leaf — smaller, upper left ──
    const ghostLeaf = buildRealisticLeaf(col, 0.12, 0.03, geos, mats);
    ghostLeaf.scale.setScalar(0.5);
    ghostLeaf.position.set(-3.2, 1.2, -2);
    ghostLeaf.rotation.z = -0.7;
    scene.add(ghostLeaf);

    // ── Tiny accent leaf — lower centre ──
    const tinyLeaf = buildRealisticLeaf(col, 0.07, 0.02, geos, mats);
    tinyLeaf.scale.setScalar(0.3);
    tinyLeaf.position.set(0.2, -2.5, -3);
    tinyLeaf.rotation.z = 1.1;
    scene.add(tinyLeaf);

    // ── Mouse parallax ──
    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 0.4;
      my = (e.clientY / H - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      // particles react to mouse
      particles.rotation.y += (mx * 0.5 - particles.rotation.y) * 0.02;
      particles.rotation.x += (my * 0.5 - particles.rotation.x) * 0.02;
      particles.rotation.z += 0.0002;

      // main leaf — slow multi-axis spin
      mainLeaf.rotation.y += 0.006;
      mainLeaf.rotation.x += 0.004;
      mainLeaf.rotation.z += 0.001;

      // ghost leaf — counter spin
      ghostLeaf.rotation.y -= 0.005;
      ghostLeaf.rotation.x += 0.003;
      ghostLeaf.rotation.z -= 0.002;

      // tiny leaf — faster tumble
      tinyLeaf.rotation.x += 0.009;
      tinyLeaf.rotation.y -= 0.005;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [accent, count]);

  return (
    <div ref={mountRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />
  );
}

// ── ThreeDarkBg — for dark sections (services, gallery, CTA) ─────────────────
export function ThreeDarkBg({
  accent = "#6BBF3E",
  count = 1000,
}: {
  accent?: string;
  count?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "0";
    mount.appendChild(renderer.domElement);

    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];
    const col = new THREE.Color(accent);

    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pPos[i] = (Math.random() - 0.5) * 22;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: col, size: 0.025, transparent: true, opacity: 0.38 });
    geos.push(pGeo); mats.push(pMat);
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Floating ghost leaf for dark sections
    const leaf = buildRealisticLeaf(col, 0.07, 0.02, geos, mats);
    leaf.scale.setScalar(0.6);
    leaf.position.set(1.5, 0, -2);
    scene.add(leaf);

    const torusGeo = new THREE.TorusKnotGeometry(1.5, 0.35, 80, 12);
    const torusMat = new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.04 });
    geos.push(torusGeo); mats.push(torusMat);
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 0.4;
      my = (e.clientY / H - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      particles.rotation.y += (mx * 0.5 - particles.rotation.y) * 0.02;
      particles.rotation.x += (my * 0.5 - particles.rotation.x) * 0.02;
      particles.rotation.z += 0.0003;
      leaf.rotation.y += 0.005;
      leaf.rotation.x += 0.003;
      torus.rotation.x += 0.003;
      torus.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [accent, count]);

  return (
    <div ref={mountRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />
  );
}
