import * as THREE from 'three';

export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.prepend(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return renderer;
}

export const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x88bbdd, 0.008);

export const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 2.5, 5);
camera.lookAt(0, 3, -30);

export function createLighting(): void {
  const ambient = new THREE.AmbientLight(0x6688aa, 0.6);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0x87ceeb, 0x2d5a27, 0.5);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff4e0, 2.0);
  sun.position.set(30, 40, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 120;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const spot1 = new THREE.SpotLight(0xffffff, 80, 100, Math.PI / 6, 0.5, 1);
  spot1.position.set(-20, 30, -30);
  spot1.target.position.set(0, 0, -30);
  spot1.castShadow = true;
  spot1.shadow.mapSize.set(1024, 1024);
  scene.add(spot1);
  scene.add(spot1.target);

  const spot2 = spot1.clone();
  spot2.position.set(20, 30, -30);
  scene.add(spot2);
}
