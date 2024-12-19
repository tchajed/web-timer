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
  task: getElementById("task"),
};

type DomState = { totalSec: number; task: string };

function updateDomTo(state: DomState) {
  const { totalSec, task } = state;
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
  // set title text to include task and elapsed time
  var title = "Timer";
  const sep = "·";
  if (task != "") {
    title = `${task} ${sep} ${title}`;
  }
  if (totalSec > 0 || timer.state == State.Running) {
    title = `${timer.elapsedText()} ${sep} ${title}`;
  }
  document.title = title;
}

var lastState: DomState = { totalSec: 0, task: "" };
// Update the DOM based on the elapsed seconds.
function updateTime() {
  const currentState: DomState = {
    totalSec: timer.secondsElapsed(),
    task: dom.task.innerText.trim(),
  };
  if (
    lastState.totalSec == currentState.totalSec &&
    lastState.task == currentState.task
  ) {
    // dom contents are already correct
    return;
  }
  lastState = currentState;
  updateDomTo(currentState);
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

// update the DOM to reflect timer.state
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
  update: () => {
    updateDom();
  },
};
export default controller;
