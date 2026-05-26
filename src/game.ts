import * as THREE from 'three';
import { scene, camera, createRenderer, createLighting } from './scene';
import { createSky } from './sky';
import { createField } from './field';
import { createPosts, POST_SPACING, CROSSBAR_HEIGHT, POSTS_Z } from './posts';
import { createBall, BALL_START } from './ball';
import { initPhysics, world, ballBody, kickBall, resetBallBody } from './physics';
import { initControls, updateControls, ControlState } from './controls';
import {
  updateScore,
  updateAttempts,
  updatePower,
  updateDirection,
  showMessage,
} from './hud';

type GamePhase = 'AIMING' | 'CHARGING' | 'FLYING' | 'RESULT';

let phase: GamePhase = 'AIMING';
let score = 0;
let attempts = 0;
let goalsMade = 0;
let controls: ControlState;
let ballMesh: THREE.Mesh;
let resultTimer = 0;
let scored = false;
let scoringChecked = false;
let prevBallZ = 0;

const clock = new THREE.Clock();

export async function startGame(): Promise<void> {
  const renderer = createRenderer();
  createLighting();
  createSky();
  createField();
  createPosts();

  await initPhysics();

  ballMesh = createBall();
  controls = initControls();

  updateScore(0);
  updateAttempts(0, 0);

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);

    switch (phase) {
      case 'AIMING':
      case 'CHARGING':
        handleAiming(dt);
        break;
      case 'FLYING':
        handleFlying(dt);
        break;
      case 'RESULT':
        handleResult(dt);
        break;
    }

    world.step();
    syncBallMesh();

    renderer.render(scene, camera);
  }

  animate();
}

function handleAiming(dt: number): void {
  updateControls(controls, dt);
  updatePower(controls.power);
  updateDirection(controls.direction);

  if (controls.charging) {
    phase = 'CHARGING';
  }

  if (controls.justKicked && controls.power > 0) {
    controls.justKicked = false;
    phase = 'FLYING';
    attempts++;
    scoringChecked = false;
    scored = false;
    prevBallZ = BALL_START.z;
    updateAttempts(goalsMade, attempts);
    kickBall(controls.power, controls.direction);
    controls.power = 0;
    updatePower(0);
  }
}

function handleFlying(dt: number): void {
  const pos = ballBody.translation();

  if (!scoringChecked && prevBallZ > POSTS_Z && pos.z <= POSTS_Z) {
    scoringChecked = true;

    const halfSpacing = POST_SPACING / 2;
    if (
      pos.x > -halfSpacing &&
      pos.x < halfSpacing &&
      pos.y > CROSSBAR_HEIGHT
    ) {
      scored = true;
      score += 3;
      goalsMade++;
      updateScore(score);
      updateAttempts(goalsMade, attempts);
    }
  }

  prevBallZ = pos.z;

  const vel = ballBody.linvel();
  const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);
  const isStopped = pos.y < 0.5 && speed < 0.5;
  const tooFar = pos.z < POSTS_Z - 30 || pos.y < -5 || Math.abs(pos.x) > 50;

  if ((scoringChecked && (isStopped || tooFar)) || (!scoringChecked && (isStopped || tooFar))) {
    phase = 'RESULT';
    resultTimer = 0;

    if (scored) {
      showMessage('GOL! +3 puntos', true);
    } else {
      showMessage('FALLASTE!', false);
    }
  }
}

function handleResult(dt: number): void {
  resultTimer += dt;
  if (resultTimer > 2.5) {
    resetKick();
  }
}

function resetKick(): void {
  phase = 'AIMING';
  controls.power = 0;
  controls.direction = 0;
  controls.charging = false;
  controls.justKicked = false;

  resetBallBody();
  ballMesh.position.copy(BALL_START);
  ballMesh.quaternion.identity();

  updatePower(0);
  updateDirection(0);
}

function syncBallMesh(): void {
  const pos = ballBody.translation();
  const rot = ballBody.rotation();
  ballMesh.position.set(pos.x, pos.y, pos.z);
  ballMesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
}
