'use strict';

/**
 * Representa una variable
 * @constructor
 * @param {WebGLRenderingContext} gl Contexto de renderizado WebGL.
 * @param {WebGLActiveInfo} info Información de la variable.
 */
fre.gl.Variable = function (info) {
  this.name = info.name;
  this.type = info.type;
  this.size = info.size;
};

module.exports = fre.gl.Variable;
