'use strict';

/**
 * Representa un mapa de variables uniform.
 * @constructor
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.UniformsMap = function (program) {
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

module.exports = fre.gl.UniformsMap;
