import { startGame } from './game';

startGame().catch((err) => {
  console.error('Failed to start game:', err);
  document.body.innerHTML = `
    <div style="color:white;padding:40px;font-family:sans-serif;">
      <h1>Error al iniciar el juego</h1>
      <p>${err.message}</p>
    </div>
  `;
});
