'use strict';

/**
 * Representa una colección de variables attribute.
 * @constructor
 * @param {WebGLRenderingContext} gl Context de renderizado WebGL.
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.AttributesCollection = function (gl, program) {
  var num = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < num; i++) {
    var info = gl.getActiveAttrib(program, i);
    if (!info) {
      break;
    }

    var attribute = new fre.gl.Attribute(gl, program, info);
    this[info.name] = attribute;
  }
};

/**
 * Establece el valor de todos los attributes.
 * @param {Object} data Valores a establecer.
 */
fre.gl.AttributesCollection.prototype.setCollection = function (data) {
  var attribsNames = Object.keys(this);

  for (var i = 0, len = attribsNames.length; i < len; i++) {
    var name = attribsNames[i];
    var attrib = this[name];
    var attribData = data[name];

    // ¿Hay un buffer? Establece los datos al puntero.
    if (attribData.buffer)  {
      attrib.setPointer(attribData);
    } else {
      attrib.set(attribData);
    }
  }
};

module.exports = fre.gl.AttributesCollection;
