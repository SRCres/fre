'use strict';

var fre = require('../fre');

/**
 * Representa un buffer.
 * @constructor
 * @param {WebGLRenderingContext} gl Context de renderizado WebGL.
 * @param {Number} target Buffer objetivo.
 * @param {Number | ArrayBuffer} data Array de puntos o tamaño del buffer.
 * @param {Number} usage Uso del buffer.
 */
fre.gl.Buffer = function (gl, target, data, usage) {
  var buffer = gl.createBuffer();

  // Verifica la creación
  if (!buffer) {
    fre.error('Incapaz de crear el buffer.');
    return null;
  }

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);

  this.target = target;
  this.webGLBuffer = buffer;
};

/**
 * Establece datos en el buffer.
 * @param {Number} offset Offset en el WebGLBuffer.
 * @param {ArrayBuffer} data Array de puntos.
 */
fre.gl.Buffer.prototype.set = function (offset, data) {
  gl.bindBuffer(this.target, this.webGLBuffer);
  gl.bufferSubData(this.target, offset, data);
};

module.exports = fre.gl.Buffer;
