'use strict';

/**
 * Representa un mapa de variables attribute.
 * @constructor
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.AttributesMap = function (program) {
  var num = fre.gl.context.getProgramParameter(program, fre.gl.context.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < num; i++) {
    var info = fre.gl.context.getActiveAttrib(program, i);
    if (!info) {
      break;
    }

    var attribute = new fre.gl.Attribute(program, info);
    this[info.name] = attribute;
  }
};

module.exports = fre.gl.AttributesMap;
