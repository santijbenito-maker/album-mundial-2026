const scoreEl = document.getElementById('score-value')!;
const attemptsEl = document.getElementById('attempts-value')!;
const powerFill = document.getElementById('power-bar-fill')!;
const dirArrow = document.getElementById('direction-arrow')!;
const dirText = document.getElementById('direction-text')!;
const messageEl = document.getElementById('message')!;
const instructionsEl = document.getElementById('instructions')!;

export function updateScore(score: number): void {
  scoreEl.textContent = String(score);
}

export function updateAttempts(made: number, total: number): void {
  attemptsEl.textContent = `Intentos: ${made} / ${total}`;
}

export function updatePower(pct: number): void {
  powerFill.style.width = `${pct}%`;
}

export function updateDirection(angle: number): void {
  const deg = (angle * 180) / Math.PI;
  dirArrow.style.transform = `rotate(${deg}deg)`;

  if (Math.abs(deg) < 2) {
    dirText.textContent = 'Centro';
  } else if (deg < 0) {
    dirText.textContent = `Izquierda ${Math.abs(Math.round(deg))}°`;
  } else {
    dirText.textContent = `Derecha ${Math.round(deg)}°`;
  }
}

export function showMessage(text: string, isGoal: boolean): void {
  messageEl.textContent = text;
  messageEl.className = `show ${isGoal ? 'goal' : 'miss'}`;
  instructionsEl.style.opacity = '0';
  setTimeout(() => {
    messageEl.className = '';
    instructionsEl.style.opacity = '0.6';
  }, 2000);
}
