var gulp = require('gulp');

gulp.task('default', function() {
  gulp.start('watchify', 'browserSync');
});