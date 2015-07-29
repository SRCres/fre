var gulp = require('gulp'),
    browserifyTask = require('./browserify');

gulp.task('watchify', function() {
  return browserifyTask(true);
});