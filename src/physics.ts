import RAPIER from '@dimforge/rapier3d-compat';
import { BALL_START } from './ball';
import {
  POST_SPACING,
  CROSSBAR_HEIGHT,
  POST_TOTAL_HEIGHT,
  POST_RADIUS,
  POSTS_Z,
} from './posts';

export let world: RAPIER.World;
export let ballBody: RAPIER.RigidBody;

export async function initPhysics(): Promise<void> {
  await RAPIER.init();

  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

  const groundDesc = RAPIER.ColliderDesc.cuboid(75, 0.1, 100);
  groundDesc.setTranslation(0, -0.1, 0);
  groundDesc.setRestitution(0.3);
  groundDesc.setFriction(0.8);
  world.createCollider(groundDesc);

  const halfSpacing = POST_SPACING / 2;
  const halfHeight = POST_TOTAL_HEIGHT / 2;

  const leftPostDesc = RAPIER.ColliderDesc.cylinder(halfHeight, POST_RADIUS);
  leftPostDesc.setTranslation(-halfSpacing, halfHeight, POSTS_Z);
  leftPostDesc.setRestitution(0.6);
  world.createCollider(leftPostDesc);

  const rightPostDesc = RAPIER.ColliderDesc.cylinder(halfHeight, POST_RADIUS);
  rightPostDesc.setTranslation(halfSpacing, halfHeight, POSTS_Z);
  rightPostDesc.setRestitution(0.6);
  world.createCollider(rightPostDesc);

  const crossbarHalfLen = (POST_SPACING + POST_RADIUS * 2) / 2;
  const crossbarDesc = RAPIER.ColliderDesc.cylinder(crossbarHalfLen, POST_RADIUS);
  crossbarDesc.setTranslation(0, CROSSBAR_HEIGHT, POSTS_Z);
  crossbarDesc.setRotation({ x: 0, y: 0, z: Math.sin(Math.PI / 4), w: Math.cos(Math.PI / 4) });
  crossbarDesc.setRestitution(0.6);
  world.createCollider(crossbarDesc);

  const supportDesc = RAPIER.ColliderDesc.cylinder(CROSSBAR_HEIGHT / 2, 0.12);
  supportDesc.setTranslation(0, CROSSBAR_HEIGHT / 2, POSTS_Z);
  supportDesc.setRestitution(0.6);
  world.createCollider(supportDesc);

  createBallBody();
}

export function createBallBody(): void {
  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(BALL_START.x, BALL_START.y, BALL_START.z)
    .setLinearDamping(0.3)
    .setAngularDamping(0.5);

  ballBody = world.createRigidBody(bodyDesc);

  const ballCollider = RAPIER.ColliderDesc.ball(0.18);
  ballCollider.setRestitution(0.5);
  ballCollider.setFriction(0.6);
  ballCollider.setDensity(0.44);
  world.createCollider(ballCollider, ballBody);
}

export function resetBallBody(): void {
  world.removeRigidBody(ballBody);
  createBallBody();
}

export function kickBall(power: number, directionAngle: number): void {
  const maxForce = 22;
  const force = (power / 100) * maxForce;

  const upForce = force * 0.7;
  const forwardForce = -force * 1.0;
  const sideForce = Math.sin(directionAngle) * force * 0.5;

  ballBody.applyImpulse(
    { x: sideForce, y: upForce, z: forwardForce },
    true
  );

  ballBody.applyTorqueImpulse(
    { x: -force * 0.05, y: 0, z: 0 },
    true
  );
}
