var browserSync = require('browser-sync'),
    config = require('../config').browserSync,
    gulp = require('gulp');

gulp.task('browserSync', function () {
  browserSync(config);
});
