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

const watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {},
  })
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

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

exports.default = gulp.series(gulp.parallel(copyHtml, styles), bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);

export function watch() {
  gulp.watch(["src/*.html"], {}, copyHtml);
  gulp.watch(["styles/*.less"], {}, styles);
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
