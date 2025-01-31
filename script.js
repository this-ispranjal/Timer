const timers = [
  { id: "tmod", checkbox: "tmod-checkbox" },
  { id: "grammarian", checkbox: "grammarian-checkbox" },
  { id: "pre-speech", checkbox: "pre-speech-checkbox" },
  { id: "table-topic", checkbox: "table-topic-checkbox" },
  { id: "general-evaluator", checkbox: "general-evaluator-checkbox" },
  { id: "evaluator", checkbox: "evaluator-checkbox" },
  { id: "ahh-counter", checkbox: "ahh-counter-checkbox" },
];

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const timerClock = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const warningTimes = {
  green: document.getElementById("green-time"),
  yellow: document.getElementById("yellow-time"),
  red: document.getElementById("red-time"),
  disqualification: document.getElementById("disqualification-time"),
};

let activeTimer = null;
let interval = null;
let elapsedTime = 0;

// Enable/disable start button based on checkbox selection
document.querySelectorAll(".timer-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      // Uncheck all other checkboxes
      document.querySelectorAll(".timer-checkbox").forEach((cb) => {
        if (cb !== e.target) cb.checked = false;
      });
      // Enable start button
      startButton.disabled = false;
      // Update warning timeline
      updateWarningTimeline(e.target.id.replace("-checkbox", ""));
    } else {
      startButton.disabled = true;
    }
  });
});

// Update warning timeline
function updateWarningTimeline(timerId) {
  const duration = parseInt(document.getElementById(timerId).value) * 60; // Convert to seconds
  warningTimes.green.textContent = formatTime(duration);
  warningTimes.yellow.textContent = formatTime(duration + 30);
  warningTimes.red.textContent = formatTime(duration + 60);
  warningTimes.disqualification.textContent = formatTime(duration + 90);
}

// Format time in MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// Start button click handler
startButton.addEventListener("click", () => {
  const selectedTimer = timers.find(
    (t) => document.getElementById(t.checkbox).checked
  );
  if (selectedTimer) {
    const timeInMinutes = parseInt(
      document.getElementById(selectedTimer.id).value
    );
    startTimer(timeInMinutes * 60); // Convert minutes to seconds
    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = false;
  }
});

// Stop button click handler
stopButton.addEventListener("click", () => {
  clearInterval(interval);
  startButton.disabled = false;
  stopButton.disabled = true;
});

// Reset button click handler
resetButton.addEventListener("click", () => {
  clearInterval(interval);
  elapsedTime = 0;
  updateTimerDisplay(elapsedTime);
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;
  document.querySelector(".container").style.backgroundColor = "#fff";
  document.querySelector(".left-section").style.backgroundColor = "#f9f9f9";
  document.querySelector(".right-section").style.backgroundColor = "#333";
});

// Timer logic
function startTimer(duration) {
  elapsedTime = 0;
  updateTimerDisplay(elapsedTime);

  interval = setInterval(() => {
    elapsedTime++;
    updateTimerDisplay(elapsedTime);

    // Warning logic
    if (elapsedTime >= duration && elapsedTime < duration + 30) {
      changeContainerColor("green");
    } else if (elapsedTime >= duration + 30 && elapsedTime < duration + 60) {
      changeContainerColor("yellow");
    } else if (elapsedTime >= duration + 60 && elapsedTime < duration + 90) {
      changeContainerColor("red");
    } else if (elapsedTime >= duration + 90) {
      changeContainerColor("black");
      clearInterval(interval);
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerClock.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

// Change container color based on warning
function changeContainerColor(color) {
  const container = document.querySelector(".container");
  const leftSection = document.querySelector(".left-section");
  const rightSection = document.querySelector(".right-section");

  container.style.backgroundColor = color;
  leftSection.style.backgroundColor = color;
  rightSection.style.backgroundColor = color;
}
