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

  lastRunSeconds(now: Date): number {
    if (this.timeStarted == null) {
      console.error(`unexpected call to lastRunSeconds with no timeStarted`);
      console.info(self);
      return 0;
    }
    const msElapsedThisRun = now.getTime() - this.timeStarted.getTime();
    return msElapsedThisRun / 1000;
  }

  secondsElapsedNow(now: Date): number {
    if (this.state == State.NotStarted) {
      return 0;
    } else if (this.state == State.Paused) {
      return this.priorSecondsElapsed;
    } else {
      // this.state == State.Running
      return Math.round(this.priorSecondsElapsed + this.lastRunSeconds(now));
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

  start() {
    this.startNow(new Date());
  }

  pauseNow(now: Date) {
    // if not even started we don't move into paused state
    if (this.state == State.Paused || this.state == State.NotStarted) {
      return;
    }
    this.priorSecondsElapsed += this.lastRunSeconds(now);
    this.state = State.Paused;
    this.timeStarted = null;
  }

  pause() {
    this.pauseNow(new Date());
  }

  reset() {
    this.state = State.NotStarted;
    this.priorSecondsElapsed = 0;
    this.timeStarted = null;
  }
}
