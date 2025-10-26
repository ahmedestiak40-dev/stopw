let startTime, updatedTime, difference = 0;
let timerInterval;
let running = false;
let lapCount = 0;

const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStop");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const laps = document.getElementById("laps");
const lapSound = document.getElementById("lapSound");
const stopwatchDiv = document.getElementById("stopwatch");
const digitalClock = document.getElementById("digitalClock");

// Update stopwatch display
function updateDisplay(time) {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  display.textContent =
    (hours < 10 ? "0" : "") + hours + ":" +
    (minutes < 10 ? "0" : "") + minutes + ":" +
    (seconds < 10 ? "0" : "") + seconds;
}

// Update digital clock in real-time
function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  digitalClock.textContent =
    (h < 10 ? "0" : "") + h + ":" +
    (m < 10 ? "0" : "") + m + ":" +
    (s < 10 ? "0" : "") + s;
}
setInterval(updateClock, 1000);
updateClock(); // initialize immediately

// Start / Pause
startStopBtn.addEventListener("click", () => {
  if (!running) {
    running = true;
    startStopBtn.textContent = "Pause";
    startTime = new Date().getTime() - difference;
    timerInterval = setInterval(() => {
      updatedTime = new Date().getTime();
      difference = updatedTime - startTime;
      updateDisplay(difference);
    }, 100);
  } else {
    running = false;
    startStopBtn.textContent = "Start";
    clearInterval(timerInterval);
  }
});

// Reset
resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  running = false;
  difference = 0;
  updateDisplay(0);
  startStopBtn.textContent = "Start";
  laps.innerHTML = "";
  lapCount = 0;
});

// Lap
lapBtn.addEventListener("click", () => {
  if (running) {
    lapCount++;
    const li = document.createElement("li");
    li.textContent = `Lap ${lapCount}: ${display.textContent}`;
    laps.prepend(li);
    lapSound.play();
  }
});

// Mobile swipe gestures
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

stopwatchDiv.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

stopwatchDiv.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) startStopBtn.click();  // swipe right = start/pause
    else resetBtn.click();                 // swipe left = reset
  } else if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
    if (deltaY < 0) lapBtn.click();       // swipe up = lap
  }
});
