import timer from "./timer_controller";
import { getElementById } from "./utils";

const dom = {
  start_stop_btn: getElementById("start_stop"),
  reset_btn: getElementById("reset"),
  task: getElementById("task"),
}

/// Set up task/window hash UI.

function hashToTask(hash: string): string {
  if (!hash) {
    return "";
  }
  var text = decodeURI(hash);
  if (text[0] == "#") {
    text = text.substring(1, text.length);
  }
  return text;
}

function loadWindowHash() {
  dom.task.innerText = hashToTask(window.location.hash);
}

// on initial document load
loadWindowHash();

// when hash is changed by user
window.addEventListener("hashchange", loadWindowHash);

dom.task.addEventListener("focusout", _e => {
  window.location.hash = dom.task.innerText;
});

/// Set up timer UI.

function startStop() {
  if (timer.isRunning()) {
    timer.pause();
  } else {
    timer.start();
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

function startEditing() {
  dom.task.focus();
  const sel = window.getSelection();
  if (!sel) {
    return;
  }
  // reset selection to front
  sel.collapseToStart();
  // select entire task input
  sel.modify("extend", "right", "line");
}

// Keyboard shortcuts

document.onkeydown = e => {
  // editable task field
  if (e.target == dom.task) {
    if (e.key == "Enter") {
      dom.task.blur();
      // stop event from propagating (that is, from adding a newline to text
      // field)
      return false;
    }
    return;
  }
  const shortcuts = new Map<string, () => void>([
    [" ", startStop],
    ["r", reset],
    ["p", timer.pause],
    ["e", startEditing],
  ]);
  const cb = shortcuts.get(e.key);
  if (cb) {
    cb();
    return false;
  }
};
