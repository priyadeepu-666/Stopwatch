const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('laps');

let startTime = 0, elapsed = 0, timerId = null;
let isRunning = false;
let lapCount = 0;
let lastLapElapsed = 0;

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:` +
         `${s.toString().padStart(2,'0')}.${cs.toString().padStart(2,'0')}`;
}

function update() {
  elapsed = Date.now() - startTime;
  display.textContent = formatTime(elapsed);
  timerId = requestAnimationFrame(update);
}

startBtn.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsed;
    timerId = requestAnimationFrame(update);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }
});

pauseBtn.addEventListener('click', () => {
  if (isRunning) {
    isRunning = false;
    cancelAnimationFrame(timerId);
    elapsed = Date.now() - startTime;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
});

lapBtn.addEventListener('click', () => {
  if (isRunning) {
    lapCount++;
    const lapElapsed = elapsed - lastLapElapsed;
    lastLapElapsed = elapsed;
    const li = document.createElement('li');
    li.textContent = `Lap ${lapCount}: ${formatTime(lapElapsed)} (total ${formatTime(elapsed)})`;
    lapsList.prepend(li);
  }
});

resetBtn.addEventListener('click', () => {
  cancelAnimationFrame(timerId);
  isRunning = false;
  elapsed = 0;
  lapCount = 0;
  lastLapElapsed = 0;
  display.textContent = '00:00:00.00';
  lapsList.innerHTML = '';
  startBtn.disabled = false;
  pauseBtn.disabled = lapBtn.disabled = resetBtn.disabled = true;
});
