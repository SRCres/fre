var _ = require('lodash'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    bundleLogger = require('../util/bundleLogger'),
    config = require('../config').browserify,
    gulp = require('gulp'),
    handleErrors = require('../util/handleErrors'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

var browserifyTask = function(devMode) {
  if (devMode) {
    _.extend(config, watchify.args, { debug: true });
  }

  var b = browserify(config);

  var bundle = function() {
    bundleLogger.start(config.outputName);

    return b
      .bundle()
      .on('error', handleErrors)
      .pipe(source(config.outputName))
      .pipe(gulp.dest(config.dest))
      .pipe(browserSync.reload({
        stream: true
      }));
  };

  if (devMode) {
    b = watchify(b);
    b.on('update', bundle);
    bundleLogger.watch(config.outputName);
  }

  return bundle();

// Start bundling with Browserify for each bundleConfig specified
//return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));
};

gulp.task('browserify', function() {
  return browserifyTask();
});

module.exports = browserifyTask;