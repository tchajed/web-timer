import { State } from "./timer";
import timer from "./timer_controller";
import { getElementById } from "./utils";

const dom = {
  start_stop_btn: getElementById("start_stop"),
  reset_btn: getElementById("reset"),
  task: getElementById("task"),
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


function reset() {
  timer.reset();
}

dom.reset_btn.addEventListener("click", _e => {
  reset();
});

// Keyboard shortcuts

document.onkeyup = e => {
  // skip events destined for editable task field
  if (e.target == dom.task) {
    return;
  }
  const shortcuts = new Map<string, () => any>([
    [" ", startStop],
    ["r", reset],
    ["p", timer.pause],
  ]);
  const cb = shortcuts.get(e.key);
  if (cb) {
    cb();
  }
};
