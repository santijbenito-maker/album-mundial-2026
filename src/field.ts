import * as THREE from 'three';
import { scene } from './scene';

function createGrassTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d7a32';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const shade = Math.random() > 0.5 ? '#1e6b24' : '#3a8c3f';
    ctx.strokeStyle = shade;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 2, y - Math.random() * 6);
    ctx.stroke();
  }

  for (let stripe = 0; stripe < size; stripe += 64) {
    ctx.fillStyle = stripe % 128 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, stripe, size, 64);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 40);
  return tex;
}

function createFieldLines(): THREE.Group {
  const group = new THREE.Group();
  const lineMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.0,
  });

  function addLine(x: number, z: number, width: number, depth: number) {
    const geo = new THREE.PlaneGeometry(width, depth);
    const mesh = new THREE.Mesh(geo, lineMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.01, z);
    group.add(mesh);
  }

  const fieldW = 70;
  const halfW = fieldW / 2;

  addLine(0, -30, fieldW, 0.15);
  addLine(0, -52, fieldW, 0.15);
  addLine(0, -8, fieldW, 0.15);

  addLine(-halfW, -30, 0.15, 50);
  addLine(halfW, -30, 0.15, 50);

  const dashCount = 11;
  for (let i = 0; i <= dashCount; i++) {
    const xPos = -halfW + (fieldW / dashCount) * i;
    addLine(xPos, -30, 0.1, 1.5);
  }

  return group;
}

export function createField(): THREE.Mesh {
  const grassTex = createGrassTexture();
  const fieldGeo = new THREE.PlaneGeometry(150, 200);
  const fieldMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    roughness: 0.9,
    metalness: 0.0,
  });

  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.rotation.x = -Math.PI / 2;
  field.position.y = 0;
  field.receiveShadow = true;

  scene.add(field);
  scene.add(createFieldLines());

  return field;
}
