# Timer

[![CI](https://github.com/tchajed/web-timer/actions/workflows/main.yml/badge.svg)](https://github.com/tchajed/web-timer/actions/workflows/main.yml)

Web-based timer for tracking time on a task.

Keyboard shortcuts:
- space to pause/resume
- r to reset
- p to pause
- e to edit task description

[![screenshot of timer showing 0m 32s](img/screenshot.png)](https://tchajed.github.io/web-timer/)

## Developing

We use [Parcel](https://parceljs.org/) to build and develop, and pnpm as a package manager.

`nvm use` is required since Parcel doesn't work on node.js > 22.6 (you'll get a
SIGSEGV error).

```sh
nvm use
pnpm install
pnpm run build
```

Run `pnpm run start` to run the parcel development server.
