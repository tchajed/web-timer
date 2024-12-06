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

We use [Parcel](https://parceljs.org/) to build and develop, pnpm as a package manager, and prettier for formatting.

```sh
pnpm install
pnpm run build
```

Run `pnpm run dev` to run the parcel development server.

Run `pnpm fmt` to format the code.

## Tech stack

It's just JavaScript, HTML, and CSS. (Except that we actually use TypeScript and Less.) There are no dependencies.

## Acknowledgment

The first version of this timer (including its design) was written by Jon Gjengset.
