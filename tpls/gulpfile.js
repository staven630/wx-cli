const gulp = require('gulp')
const fs = require('fs')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const del = require('del')
const postcss = require('gulp-postcss')
const base64 = require('postcss-font-base64')
const CONFIG = JSON.parse(fs.readFileSync('./wx.json'))

const SRCS = {
  root: `${CONFIG.clientName}`,
  dist: `${CONFIG.projectName}`,
  scss: `${CONFIG.clientName}/**/*.scss`,
  wxml: [`${CONFIG.clientName}/**/*.wxml`, `${CONFIG.clientName}/**/*.wxs`],
  js: [`${CONFIG.clientName}/**/*.js`],
  json: [`${CONFIG.clientName}/**/*json`],
}

const wxml = () => {
  return gulp.src(SRCS.wxml).pipe(gulp.dest(SRCS.dist))
}

const wxss = () => {
  return gulp
    .src(SRCS.scss)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss([base64()]))
    .pipe(rename(path => (path.extname = '.wxss')))
    .pipe(gulp.dest(SRCS.dist))
}

const js = () => {
  return gulp.src(SRCS.js).pipe(gulp.dest(SRCS.dist))
}

const json = () => {
  return gulp.src(SRCS.json).pipe(gulp.dest(SRCS.dist))
}

const clean = () => {
  return del([`${SRCS.dist}/**`])
}

const watch = () => {
  gulp.watch(SRCS.scss, wxss)
  gulp.watch(SRCS.wxml, wxml)
  gulp.watch(SRCS.js, js)
  gulp.watch(SRCS.json, json)
}

const compile = gulp.parallel(wxss, wxml, js, json)
const serve = gulp.series(compile, watch)
const build = gulp.series(clean, compile, watch)

gulp.task('serve', serve)
gulp.task('build', build)
