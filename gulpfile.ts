import browserify from "browserify";
import fancy_log from "fancy-log";
import gulp from "gulp";
import tsify from "tsify";
import source from "vinyl-source-stream";
import watchify from "watchify";
const server: any = require("gulp-server-livereload");

const paths = {
  pages: ["src/*.html"],
}

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

gulp.task("copy-html", () => {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
})

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);

gulp.task("webserver", () => {
  gulp.src(".")
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});
