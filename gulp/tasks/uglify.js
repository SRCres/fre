var browserifyTask = require('./browserify'),
    buffer = require('vinyl-buffer'),
    env = require('../config').production,
    gulp = require('gulp'),
    size = require('gulp-filesize'),
    uglify = require('gulp-uglify');

gulp.task('uglify', function () {
  return browserifyTask(env)
    .pipe(buffer())
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest(env.dest));
});
