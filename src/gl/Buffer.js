'use strict';

var buffer = Object.create(null, {
  target: {
    writable: true,
    enumerable: true
  },
  webGLBuffer: {
    writable: true,
    enumerable: true
  },
  set: {
    value: function (offset, value) {
      webGL.bindBuffer(this.target, this.webGLBuffer);
      webGL.bufferSubData(this.target, offset, value);
    },
    enumerable: true
  }
});

Object.preventExtensions(buffer);

module.exports = buffer;
