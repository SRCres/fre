'use strict';

var loader = Object.create(null, {
  ajax: {
    value: require('./ajax'),
    enumerable: true
  }
});

Object.preventExtensions(loader);

module.exports = loader;
