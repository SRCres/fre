'use strict';

/**
 * Representa una colección de variables uniform.
 * @constructor
 * @param {WebGLRenderingContext} gl Context de renderizado WebGL.
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.UniformsCollection = function (gl, program) {
  var num = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < num; i++) {
    var info = gl.getActiveUniform(program, i);
    if (!info) {
      break;
    }
    var name = info.name;
    // Quita el sufijo de array
    if (name.substr(-3) === "[0]") {
      name = name.substr(0, name.length - 3);
    }

    var uniform = new fre.gl.Uniform(gl, program, info);
    this[name] = uniform;
  }
};

/**
 * Establece el valor de todos los unifroms.
 * @param {Object} data Valores a establecer.
 */
fre.gl.UniformsCollection.prototype.setCollection = function (data) {
  var uniformsNames = Object.keys(this);

  for (var i = 0, len = uniformsNames.length; i < len; i++) {
    var name = uniformsNames[i];
    var uniform = this[name];

    uniform.set(data[name]);
  }
};

module.exports = fre.gl.UniformsCollection;
