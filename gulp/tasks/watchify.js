var browserifyTask = require('./browserify'),
    env = require('../config').development,
    gulp = require('gulp');

gulp.task('watchify', function () {
  return browserifyTask(env);
});
