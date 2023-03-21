import { State, Timer } from "./timer";
import { getElementById, padStart } from "./utils";

const timer = new Timer();
const dom = {
  counters: getElementById("counters"),
  hr: getElementById("hr"),
  min: getElementById("min"),
  sec: getElementById("sec"),
  start_stop_btn: getElementById("start_stop"),
  reset_btn: getElementById("reset"),
}

var lastUpdate: number = 0;
function updateTime() {
  const totalSec = timer.secondsElapsed();
  if (lastUpdate == totalSec) {
    return;
  }
  lastUpdate = totalSec;
  const hr = Math.floor(totalSec / 3600);
  const min = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  if (hr > 0) {
    dom.counters.classList.add("hr");
    dom.counters.classList.remove("min");
    dom.hr.textContent = `${hr}`;
    dom.min.textContent = padStart(`${min}`, 2, "0");
  } else {
    dom.counters.classList.add("min");
    dom.counters.classList.remove("hr");
    dom.min.textContent = `${min}`;
    dom.sec.textContent = padStart(`${sec}`, 2, "0");
  }
}

class Updater {
  cb: () => any;
  intervalId: ReturnType<typeof setInterval> | null;

  constructor(cb: () => any) {
    this.cb = cb;
    this.intervalId = null;
  }

  stop() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  start() {
    if (this.intervalId == null) {
      this.intervalId = setInterval(this.cb, 200);
    }
  }
}

const updater = new Updater(updateTime);

function updateDom() {
  if (timer.state == State.Running) {
    dom.counters.classList.add("running");
    updater.start();
    dom.start_stop_btn.innerText = "pause";
  } else if (timer.state == State.NotStarted) {
    updater.stop();
    dom.counters.classList.remove("running");
    dom.start_stop_btn.innerText = "start";
  } else {
    // timer.state == State.Paused
    updater.stop();
    dom.counters.classList.remove("running");
    dom.start_stop_btn.innerText = "resume";
  }
  updateTime();
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
}

updateDom();

const controller = {
  timer,
  start,
  pause,
  reset,
  isRunning: (): boolean => {
    return timer.state == State.Running;
  },
}
export default controller;
