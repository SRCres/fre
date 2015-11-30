'use strict';

var fre = require('../fre');

/**
 * Representa un buffer.
 * @constructor
 * @param {Number} target Buffer objetivo.
 * @param {Number | ArrayBuffer} data Array de puntos o tamaño del buffer.
 * @param {Number} usage Uso del buffer.
 */
fre.gl.Buffer = function (target, data, usage) {
  var buffer = fre.gl.context.createBuffer();

  // Verifica la creación
  if (!buffer) {
    fre.error('Incapaz de crear el buffer.');
    return null;
  }

  fre.gl.context.bindBuffer(target, buffer);
  fre.gl.context.bufferData(target, data, usage);

  this.target = target;
  this.webGLBuffer = buffer;
};

/**
 * Establece datos en el buffer.
 * @param {Number} offset Offset en el WebGLBuffer.
 * @param {ArrayBuffer} data Array de puntos.
 */
fre.gl.Buffer.prototype.set = function (offset, data) {
  fre.gl.context.bindBuffer(this.target, this.webGLBuffer);
  fre.gl.context.bufferSubData(this.target, offset, data);
};

module.exports = fre.gl.Buffer;
