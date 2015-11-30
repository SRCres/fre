'use strict';

/**
 * Representa una colección de variables uniform.
 * @constructor
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.UniformsCollection = function (program) {
  var num = fre.gl.context.getProgramParameter(program, fre.gl.context.ACTIVE_UNIFORMS);
  for (var i = 0; i < num; i++) {
    var info = fre.gl.context.getActiveUniform(program, i);
    if (!info) {
      break;
    }
    var name = info.name;
    // Quita el sufijo de array
    if (name.substr(-3) === "[0]") {
      name = name.substr(0, name.length - 3);
    }

    var uniform = new fre.gl.Uniform(program, info);
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
