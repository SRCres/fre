'use strict';

var uniform = Object.create(null, {
  name: {
    writable: true,
    enumerable: true
  },
  type: {
    writable: true,
    enumerable: true
  },
  size: {
    writable: true,
    enumerable: true
  },
  location: {
    writable: true,
    enumerable: true
  },
  set: {
    writable: true,
    enumerable: true
  }
});

Object.preventExtensions(uniform);

module.exports = uniform;
