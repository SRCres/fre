var browserify = require('browserify'),
    browserSync = require('browser-sync'),
    bundleLogger = require('../util/bundleLogger'),
    config = require('../config').browserify,
    gulp = require('gulp'),
    handleErrors = require('../util/handleErrors'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

module.exports = function(env) {
  var b = browserify(config);

  var bundle = function() {
    bundleLogger.start(env.output);

    var bundle = b.bundle();

    stream = bundle
      .on('error', handleErrors)
      .pipe(source(env.output));

    if (env.name === 'dev') {
      stream = stream
        .pipe(gulp.dest(env.dest))
        .pipe(browserSync.reload({
          stream: true
        }));
    }

    return stream;
  };

  if (env.name === 'dev') {
    var w = watchify(b);
    w.on('update', bundle);
    bundleLogger.watch(env.output);
  }

  return bundle();
};
