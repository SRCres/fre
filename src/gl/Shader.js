'use strict';

var FRAGMENT_SHADER = 0x8B30;
var VERTEX_SHADER = 0x8B31;

var shader = Object.create(null, {
  types: {
    value: [VERTEX_SHADER, FRAGMENT_SHADER],
    enumerable: true
  },
  webGLShader: {
    writable: true,
    enumerable: true
  }
});

module.exports = shader;
