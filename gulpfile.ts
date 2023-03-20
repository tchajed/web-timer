import browserify from "browserify";
import fancy_log from "fancy-log";
import gulp from "gulp";
import less from "gulp-less";
import path from "path";
import tsify from "tsify";
import source from "vinyl-source-stream";
import watchify from "watchify";
import browserSyncPkg from "browser-sync";
const browserSync = browserSyncPkg.create();

const browserifyConfig: browserify.Options = {
  basedir: ".",
  debug: true,
  entries: ["src/main.ts"],
  cache: {},
  packageCache: {},
};

const watchedBrowserify = watchify(
  browserify(browserifyConfig)
    .plugin(tsify)
);

const paths = {
  pages: ["src/*.html"],
}

export function copyHtml() {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
}

export function styles() {
  return gulp.src("./styles/*.less")
    .pipe(less({
      paths: [path.join(__dirname, "less", "includes")]
    }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function watchedBundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

function bundle() {
  return browserify(browserifyConfig)
    .plugin(tsify)
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

export function build() {
  gulp.series(gulp.parallel(copyHtml, styles), bundle)
}

exports.default = build;

export function watch() {
  gulp.watch(["src/*.html"], {}, copyHtml);
  gulp.watch(["styles/*.less"], {}, styles);
  gulp.series(gulp.parallel(copyHtml, styles), watchedBundle);
  watchedBrowserify.on("update", watchedBundle);
  watchedBrowserify.on("log", fancy_log);
}

export function serve() {
  browserSync.init({
    server: "./dist",
  });

  watch();

  gulp.watch(
    ["dist/*.html", "dist/css/*.css", "dist/*.js"],
    { cwd: "dist" },
    browserSync.reload,
  );

};
