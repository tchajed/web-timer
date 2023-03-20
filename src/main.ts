import { State, Timer } from "./timer";

const timer = new Timer();
const dom = {
  min: document.getElementById("min"),
  sec: document.getElementById("sec"),
  start_stop_btn: document.getElementById("start_stop"),
  reset_btn: document.getElementById("reset"),
}
var intervalId: ReturnType<typeof setInterval> = null;

function updateTime() {
  const totalSec = timer.secondsElapsed();
  const min = Math.round(totalSec / 60);
  const sec = Math.round(totalSec % 60);
  dom.min.innerText = `${min}`;
  dom.sec.innerText = `${sec}`.padStart(2, "0");
}

function stopUpdateInterval() {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function updateDom() {
  if (timer.state == State.Running) {
    dom.min.classList.add("active");
    dom.sec.classList.add("active");
    if (intervalId == null) {
      intervalId = setInterval(updateTime, 200);
    }
    dom.start_stop_btn.innerText = "pause";
  } else if (timer.state == State.NotStarted) {
    stopUpdateInterval();
    dom.min.classList.remove("active");
    dom.sec.classList.remove("active");
    dom.start_stop_btn.innerText = "start";
  } else {
    // timer.state == State.Paused
    stopUpdateInterval();
    updateTime();
    dom.min.classList.remove("active");
    dom.sec.classList.remove("active");
    dom.start_stop_btn.innerText = "resume";
  }
}

function start() {
  timer.start();
  updateDom();
}

function pause() {
  timer.pause();
  updateDom();
}

function reset() {
  timer.reset();
  updateDom();
  updateTime();
}

function startStop() {
  if (timer.state == State.NotStarted || timer.state == State.Paused) {
    start();
  } else {
    pause();
  }
}

dom.start_stop_btn.addEventListener("click", e => {
  startStop();
});

dom.reset_btn.addEventListener("click", e => {
  reset();
});
