/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  INT
  root task

  a simplified build process for the integration server
  run with `npm run int` --- see `package.json`

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var runSeq = require('run-sequence').use(gulp);

gulp.task('heroku:int', function() {
  runSeq('config', 'build');
});