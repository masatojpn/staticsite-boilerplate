const conf = require('./conf');

const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpAutoPrefixer = require('gulp-autoprefixer');
const gulpejs = require('gulp-ejs');
const autoprefixer = require('autoprefixer');
const sassGlob = require('gulp-sass-glob');
const mmq = require('gulp-merge-media-queries');
const gulpStylelint = require('gulp-stylelint');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync');
const cssSort = require('css-declaration-sorter');
const watch = require('gulp-watch');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const ejs = (done) => {
  return gulp.src([`${conf.path.src}**/!(_)*.ejs`])
    .pipe(gulpejs())
    .pipe(rename({
      extname: '.html'
    }))
  .pipe(gulp.dest(`${conf.path.dist}`))
  done();
}

const js = (done) => {
  return gulp.src(`${conf.path.src}**/!(_)*.es6`)
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(`${conf.path.dist}`))
  done();
}

const scss = (done) => {
  return gulp.src(`${conf.path.src}**/!(_)*.scss`)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(postcss([cssSort({ order: 'alphabetical' })]))
    .pipe(mmq())
    .pipe(
      gulpStylelint({
        fix: true
      })
    )
    .pipe(gulp.dest(`${conf.path.dist}`))
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest(`${conf.path.dist}`))
  done();
}

const images = (done) => {
  return gulp.src(`${conf.path.src}**/*.{jpg,jpeg,png,gif,mp4,svg}`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${conf.path.dist}`))
  done();
}

const serve = (done) => {
  browserSync.init({
    open: true,
    server: {
      baseDir: `${conf.path.dist}`,
      index: 'index.html'
    },
    port: 3000,
    reloadDelay: 1000,
    once: true,
    notify: false,
    ghostMode: false,
  });
  done();
}

const reload = (done) => {
  browserSync.reload();
  done();
}

const filewatch = (done) => {
  gulp.watch([`${conf.path.src}**/*.scss`], gulp.series(scss, reload));
  gulp.watch([`${conf.path.src}**/*.ejs`], gulp.series(ejs, reload));
  gulp.watch([`${conf.path.src}**/*.es6`], gulp.series(js, reload));
  gulp.watch([`${conf.path.src}**/*.{jpg,jpeg,png,gif}`], gulp.series(images, reload));
  done();
}

gulp.task('default', gulp.series(
  gulp.parallel(ejs, js, images, scss, filewatch),
  serve
));