import browserify from "browserify";
import fancy_log from "fancy-log";
import gulp from "gulp";
import less from "gulp-less";
import path from "path";
import tsify from "tsify";
import source from "vinyl-source-stream";
import watchify from "watchify";
import browserSync from "browser-sync";

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
    .pipe(gulp.dest("./dist/css"));
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
  browserSync({
    server: {
      baseDir: "dist",
    }
  })
  gulp.watch(
    ["dist/*.html", "dist/css/*.css", "dist/*.js"],
    { cwd: "dist" },
    browserSync.reload,
  );
};
