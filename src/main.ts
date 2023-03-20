import { State } from "./timer";
import timer from "./timer_controller";

const dom = {
  start_stop_btn: document.getElementById("start_stop"),
  reset_btn: document.getElementById("reset"),
  task: document.getElementById("task"),
}

/// Set up task/window hash UI.

function hashToTask(_hash: string) {
  var text = decodeURI(window.location.hash);
  if (text[0] == "#") {
    text = text.substring(1, text.length);
  }
  return text;
}

if (window.location.hash) {
  var text = hashToTask(window.location.hash);
  dom.task.innerText = text;
}

dom.task.addEventListener("focusout", _e => {
  window.location.hash = dom.task.innerText;
});

/// Set up timer UI.

function startStop() {
  if (timer.state() == State.NotStarted || timer.state() == State.Paused) {
    timer.start();
  } else {
    timer.pause();
  }
}

dom.start_stop_btn.addEventListener("click", _e => {
  startStop();
});

dom.reset_btn.addEventListener("click", _e => {
  timer.reset();
});
