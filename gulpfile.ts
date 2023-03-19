import gulp from "gulp";
import browserify from "browserify";
import source from "vinyl-source-stream";
import tsify from "tsify";
const paths = {
  pages: ["src/*.html"],
}

gulp.task("copy-html", () => {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
})

gulp.task(
  "default",
  gulp.series(gulp.parallel("copy-html"), () => {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/main.ts"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("dist"));
  })
);
