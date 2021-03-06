const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();
const del = require("del");
const uglify = require("gulp-uglify-es").default;
const htmlmin = require("gulp-htmlmin");

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("minhtml")).on("change", sync.reload);
  gulp.watch("source/js/*.js", gulp.series("minjs")).on("change", sync.reload);
}

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
  };

  exports.images = images;


// Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("source/img"));
};

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
  }

exports.sprite = sprite;

// uglify

const minjs = () => {
  return gulp.src("source/js/script.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
};

exports.minjs = minjs;

// htmlmin

const minhtml = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
};
exports.minhtml = minhtml;

// copy

const copy = () => {
  return gulp.src([
  "source/fonts/**/*.{woff,woff2}",
  "source/img/**",

  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

// del

const clean = () => {
  return del("build");
};

exports.clean = clean;

// build

const build = gulp.series(
  clean,
  minhtml,
  minjs,
  copy,
  styles,
  sprite,
);

exports.build = build;

// start

const start = gulp.series(
  build,
  server,
  watcher,
);

exports.start = start;

exports.default = gulp.series(
  styles, server, watcher
);
