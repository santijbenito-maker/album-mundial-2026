import * as THREE from 'three';
import { scene } from './scene';

export const POST_SPACING = 5.6;
export const CROSSBAR_HEIGHT = 3.0;
export const POST_TOTAL_HEIGHT = 10.0;
export const POST_RADIUS = 0.075;
export const POSTS_Z = -30;

export function createPosts(): THREE.Group {
  const group = new THREE.Group();

  const postMat = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.4,
    metalness: 0.6,
  });

  const halfSpacing = POST_SPACING / 2;

  const postGeo = new THREE.CylinderGeometry(
    POST_RADIUS,
    POST_RADIUS,
    POST_TOTAL_HEIGHT,
    16
  );

  const leftPost = new THREE.Mesh(postGeo, postMat);
  leftPost.position.set(-halfSpacing, POST_TOTAL_HEIGHT / 2, POSTS_Z);
  leftPost.castShadow = true;
  group.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, postMat);
  rightPost.position.set(halfSpacing, POST_TOTAL_HEIGHT / 2, POSTS_Z);
  rightPost.castShadow = true;
  group.add(rightPost);

  const crossbarGeo = new THREE.CylinderGeometry(
    POST_RADIUS,
    POST_RADIUS,
    POST_SPACING + POST_RADIUS * 2,
    16
  );
  const crossbar = new THREE.Mesh(crossbarGeo, postMat);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, CROSSBAR_HEIGHT, POSTS_Z);
  crossbar.castShadow = true;
  group.add(crossbar);

  const supportGeo = new THREE.CylinderGeometry(0.1, 0.15, CROSSBAR_HEIGHT, 16);
  const support = new THREE.Mesh(supportGeo, postMat);
  support.position.set(0, CROSSBAR_HEIGHT / 2, POSTS_Z);
  support.castShadow = true;
  group.add(support);

  const padMat = new THREE.MeshStandardMaterial({
    color: 0x1a5276,
    roughness: 0.7,
    metalness: 0.1,
  });
  const padGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.8, 16);

  const leftPad = new THREE.Mesh(padGeo, padMat);
  leftPad.position.set(-halfSpacing, 0.9, POSTS_Z);
  group.add(leftPad);

  const rightPad = new THREE.Mesh(padGeo, padMat);
  rightPad.position.set(halfSpacing, 0.9, POSTS_Z);
  group.add(rightPad);

  scene.add(group);
  return group;
}
