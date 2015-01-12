/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  SCRIPTS
  supports BUILD task

  lints the scripts with jsHint, outputs to the dev console
  concatenates all our `src/js`, uglifies it and produces
  a minified `all.min.js` and the debuggable `all.js`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');

var handleErrors = require('../util/handleErrors');

// this glob determines the order of the concatenated scripts
var scriptSrc = [
  'src/js/*.js',
  'src/js/providers/*.js',
  'src/js/services/*.js',
  'src/js/controllers/*.js',
  'src/js/directives/**/*.js',
  'src/js/rxjs-firebase/**/*.js',
  'src/js/stages/*.js',
];

var scriptPub = "./public/js";

gulp.task('scripts', function(){
  return gulp.src(scriptSrc)
    .pipe(plumber(handleErrors))
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(scriptPub))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber.stop())
    .pipe(gulp.dest(scriptPub))
});
