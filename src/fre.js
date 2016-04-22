'use strict';

window.fre = Object.create(null, {
  version: {
    value: '0.0.1',
    enumerable: true
  },
  error: {
    value: function () {
      return window.console && window.console.error ?
        window.console.error.bind(window.console) :
        function () { };
    },
    enumerable: true
  },
  loader: {
    value: require('./loader/loader'),
    enumerable: true
  },
  math: {
    value: require('./math/math'),
    enumerable: true
  },
  gl: {
    value: require('./gl/gl'),
    enumerable: true
  }
});

Object.preventExtensions(window.fre);
