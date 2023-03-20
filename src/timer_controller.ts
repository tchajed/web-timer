import { Timer, State } from "./timer";

const timer = new Timer();
const dom = {
  min: document.getElementById("min"),
  sec: document.getElementById("sec"),
  start_stop_btn: document.getElementById("start_stop"),
  reset_btn: document.getElementById("reset"),
}

var intervalId: ReturnType<typeof setInterval> = null;

// pad s to be at least minLength, by adding copies of padString to the start
function padStart(s: string, minLength: number, padString: string): string {
  var padding = "";
  while (padding.length - s.length < minLength) {
    padding += padString;
  }
  return padding + s;
};

function updateTime() {
  const totalSec = timer.secondsElapsed();
  const min = Math.round(totalSec / 60);
  const sec = Math.round(totalSec % 60);
  dom.min.innerText = `${min}`;
  dom.sec.innerText = padStart(`${sec}`, 2, "0");
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

const controller = {
  timer,
  start,
  pause,
  reset,
  state: () => {
    return timer.state;
  },
}
export default controller;
