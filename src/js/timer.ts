export enum State {
  NotStarted = "not started",
  Running = "running",
  Paused = "paused",
}

export class Timer {
  state: State;

  // tracks time from previous runs
  //
  // only incremented after a pause
  priorSecondsElapsed: number;

  // if state is Running, the time that the timer was last started
  timeStarted: Date | null;

  constructor() {
    this.state = State.NotStarted;
    this.priorSecondsElapsed = 0;
    this.timeStarted = null;
  }

  // the *Now methods take the current time so they can be tested (although
  // there are currently no tests)

  // seconds from just the ongoing run of the timer
  #lastRunSeconds(now: Date): number {
    if (this.timeStarted == null) {
      console.error(`unexpected call to lastRunSeconds with no timeStarted`);
      console.info(self);
      return 0;
    }
    const msElapsedThisRun = now.getTime() - this.timeStarted.getTime();
    return msElapsedThisRun / 1000;
  }

  // seconds the timer has tracked with the current time being now
  secondsElapsedNow(now: Date): number {
    if (this.state == State.NotStarted) {
      return 0;
    } else if (this.state == State.Paused) {
      return Math.round(this.priorSecondsElapsed);
    } else {
      // this.state == State.Running
      return Math.round(this.priorSecondsElapsed + this.#lastRunSeconds(now));
    }
  }

  secondsElapsed(): number {
    return this.secondsElapsedNow(new Date());
  }

  startNow(now: Date) {
    if (this.state == State.Running) {
      return;
    }
    this.state = State.Running;
    this.timeStarted = now;
  }

  // start the timer
  start() {
    this.startNow(new Date());
  }

  // pause the timer's current run at the current time `now`
  pauseNow(now: Date) {
    // if not even started we don't move into paused state
    if (this.state == State.Paused || this.state == State.NotStarted) {
      return;
    }
    this.priorSecondsElapsed += this.#lastRunSeconds(now);
    this.state = State.Paused;
    this.timeStarted = null;
  }

  // pause the timer
  pause() {
    this.pauseNow(new Date());
  }

  // reset the timer completely
  reset() {
    this.state = State.NotStarted;
    this.priorSecondsElapsed = 0;
    this.timeStarted = null;
  }

  // time elapsed as short human-readable string
  elapsedText(): string {
    const totalSec = this.secondsElapsed();
    const hr = Math.floor(totalSec / 3600);
    const min = Math.floor((totalSec % 3600) / 60);
    const sec = totalSec % 60;
    if (hr > 0) {
      const minTwoDigit = min.toString().padStart(2, "0");
      return `${hr}:${minTwoDigit}`;
    } else {
      const secTwoDigit = sec.toString().padStart(2, "0");
      return `${min}:${secTwoDigit}`;
    }
  }
}
