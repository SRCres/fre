'use strict';

var attribute = Object.create(null, {
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
  index: {
    writable: true,
    enumerable: true
  },
  set: {
    writable: true,
    enumerable: true
  },
  setPointer: {
    writable: true,
    enumerable: true
  }
});

module.exports = attribute;
