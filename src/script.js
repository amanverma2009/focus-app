const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const arc = document.getElementById("progress-arc");
const sessionLabel = document.querySelector(".session-mode");
const modeButtons = document.querySelectorAll(".mode-btn");
const upload = document.getElementById("audioUpload");
const audio = document.getElementById("bgMusic");

audio.src = "./assets/MANTRON(chosic.com).mp3";
audio.load();
const modes = {
  focus: { time: 25 * 60, label: "Focus Session" },
  break: { time: 5 * 60, label: "Short Break" },
  long: { time: 15 * 60, label: "Long Break" },
};

let currentMode = localStorage.getItem("mode") || "focus";
let duration = modes[currentMode].time;
let timeLeft = duration;
let interval = null;
const arcLength = 283;
let isRunning = false;

function updateDisplay() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerDisplay.textContent = `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
}

function updateProgress() {
  const progress = ((duration - timeLeft) / duration) * arcLength;
  arc.style.strokeDashoffset = arcLength - progress;
}

upload.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
  }
});

function startTimer() {
  if (interval) return;

  if (audio.src && audio.paused) {
    audio.play();
  }

  interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      updateProgress();
    } else {
      clearInterval(interval);
      interval = null;
      isRunning = false;
      startBtn.textContent = "Start";
      if (audio.src) audio.pause();
      alert("Session Complete 🎉");
      resetTimer();
    }
  }, 1000);
  isRunning = true;
  startBtn.textContent = "Pause";
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  startBtn.textContent = "Resume";
  if (audio.src) audio.pause();
}

function toggleTimer() {
  if (isRunning) pauseTimer();
  else startTimer();
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  timeLeft = duration;
  updateDisplay();
  arc.style.strokeDashoffset = arcLength;
  startBtn.textContent = "Start";
  isRunning = false;
  audio.pause();
  audio.currentTime = 0;
}

function setMode(mode, event = null) {
  currentMode = mode;
  localStorage.setItem("mode", mode);
  duration = modes[mode].time;
  timeLeft = duration;
  sessionLabel.textContent = modes[mode].label;
  resetTimer();

  modeButtons.forEach((btn) =>
    btn.classList.remove("bg-white/20", "shadow-[0_4px_16px_rgba(0,0,0,0.1)]")
  );
  if (event)
    event.target.classList.add(
      "bg-white/20",
      "shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
    );
  else
    document
      .querySelector(`[data-mode="${mode}"]`)
      .classList.add("bg-white/20", "shadow-[0_4px_16px_rgba(0,0,0,0.1)]");
}

startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
modeButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => setMode(btn.dataset.mode, e))
);

setMode(currentMode);
arc.style.strokeDasharray = arcLength;
arc.style.strokeDashoffset = arcLength;
updateDisplay();
