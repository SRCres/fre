var gulp = require('gulp');

gulp.task('production', function () {
  gulp.start('uglify');
});
