var dest = './dist';
var src = './src';

module.exports = {
  browserSync: {
    proxy: 'http://localhost/~srcres/Projects/fre/examples/'
  },
  browserify: {
    entries: src + '/fre.js',
    cache: {},
    packageCache: {}
  },
  development: {
    name: 'dev',
    dest: dest,
    output: 'fre.js'
  },
  production: {
    name: 'prod',
    dest: dest,
    output: 'fre.min.js'
  }
};