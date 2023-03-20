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
  timeStarted: Date;

  constructor() {
    this.state = State.NotStarted;
    this.priorSecondsElapsed = 0;
    this.timeStarted = null;
  }

  lastRunSeconds(now: Date): number {
    const msElapsedThisRun = now.getTime() - this.timeStarted.getTime();
    return msElapsedThisRun / 1000;
  }

  secondsElapsedNow(now: Date): number {
    if (this.state == State.NotStarted) {
      return 0;
    }
    if (this.state == State.Paused) {
      return this.priorSecondsElapsed;
    }
    if (this.state == State.Running) {
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
    if (this.state != State.Running) {
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
