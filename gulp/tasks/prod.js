/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  PROD
  root task

  like STAGING, only more buttoned up

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
// var runSeq = require('run-sequence').use(gulp);

gulp.task('heroku:production', ['build']);

// gulp.task('prod', function() {
//   runSeq('config', 'build');
// });
