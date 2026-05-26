import * as THREE from 'three';
import { scene } from './scene';

export const BALL_START = new THREE.Vector3(0, 0.18, 0);

export function createBall(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.18, 32, 24);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#f5f5dc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 80);
  ctx.lineTo(176, 80);
  ctx.moveTo(80, 128);
  ctx.lineTo(176, 128);
  ctx.moveTo(80, 176);
  ctx.lineTo(176, 176);
  ctx.stroke();

  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const map = new THREE.CanvasTexture(canvas);

  const mat = new THREE.MeshStandardMaterial({
    map,
    roughness: 0.7,
    metalness: 0.05,
    bumpMap: map,
    bumpScale: 0.02,
  });

  const ball = new THREE.Mesh(geo, mat);
  ball.scale.set(1, 0.85, 1.3);
  ball.position.copy(BALL_START);
  ball.castShadow = true;
  ball.receiveShadow = true;

  scene.add(ball);
  return ball;
}
