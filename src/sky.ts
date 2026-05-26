import * as THREE from 'three';
import { scene } from './scene';

export function createSky(): void {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#1a3a5c');
  gradient.addColorStop(0.3, '#4a90c2');
  gradient.addColorStop(0.5, '#87ceeb');
  gradient.addColorStop(0.7, '#b8dced');
  gradient.addColorStop(1.0, '#d4e8f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#ffffffcc';
  ctx.beginPath();
  ctx.arc(380, 80, 40, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 200 + 50;
    const w = Math.random() * 80 + 40;
    ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, 12 + Math.random() * 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;

  const skyGeo = new THREE.SphereGeometry(200, 32, 32);
  const skyMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyMesh);

  scene.background = new THREE.Color(0x87ceeb);
}
