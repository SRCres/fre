var dest = './dist',
    src = './src';

module.exports = {
  browserSync: {
    server: {
      baseDir: './'
    },
    startPath: 'examples'
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
