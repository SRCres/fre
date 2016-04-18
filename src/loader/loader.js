'use strict';

var loader = Object.create(null, {
  ajax: {
    value: require('./ajax'),
    enumerable: true
  }
});

module.exports = loader;
