export type ControlState = {
  charging: boolean;
  power: number;
  direction: number;
  justKicked: boolean;
};

const MAX_DIRECTION = Math.PI / 6;
const DIRECTION_SPEED = 0.025;
const POWER_SPEED = 1.5;

const keys: Record<string, boolean> = {};

export function initControls(): ControlState {
  const state: ControlState = {
    charging: false,
    power: 0,
    direction: 0,
    justKicked: false,
  };

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    keys[e.code] = true;

    if (e.code === 'Space') {
      e.preventDefault();
      if (!state.charging && state.power === 0) {
        state.charging = true;
        state.justKicked = false;
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;

    if (e.code === 'Space' && state.charging) {
      state.charging = false;
      state.justKicked = true;
    }
  });

  return state;
}

export function updateControls(state: ControlState, dt: number): void {
  if (state.charging) {
    state.power = Math.min(100, state.power + POWER_SPEED * dt * 60);
  }

  if (keys['ArrowLeft']) {
    state.direction = Math.max(-MAX_DIRECTION, state.direction - DIRECTION_SPEED);
  }
  if (keys['ArrowRight']) {
    state.direction = Math.min(MAX_DIRECTION, state.direction + DIRECTION_SPEED);
  }
}
