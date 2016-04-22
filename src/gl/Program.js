'use strict';

var program = Object.create(null, {
  shaders: {
    writable: true,
    enumerable: true
  },
  attributes: {
    writable: true,
    enumerable: true
  },
  uniforms: {
    writable: true,
    enumerable: true
  },
  webGLProgram: {
    writable: true,
    enumerable: true
  }
});

Object.preventExtensions(program);

module.exports = program;
