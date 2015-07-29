var dest = './dist';
var src = './src';

module.exports = {
  browserSync: {
    server: {
      baseDir: dest
    }
  },
  browserify: {
    entries: src + '/fre.js',
    dest: dest,
    outputName: 'fre.js'
  },
  production: {
    js: dest + '/*.js',
    dest: dest
  }
};