'use strict';

/**
 * Representa una variable con calificador attribute.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLRenderingContext} gl Context de renderizado WebGL.
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del attribute.
 */
fre.gl.Attribute = function (gl, program, info) {
  fre.gl.Variable.call(this, info);

  var setterName = fre.gl.Variable.getSetterNameByType(gl, 'vertexAttrib', info.type);

  if (!setterName) {
    return null;
  }

  var TypedArray = fre.gl.Variable.getTypedArrayByType(gl, info.type);

  this.index = gl.getAttribLocation(program, info.name);
  this.set = setter(setterName, this.index, TypedArray);
  this.setPointer = pointerSetter(this.index);

  function setter(name, index, TypedArray) {
    return function (value) {
      if (TypedArray) {
        value = new TypedArray(value);
      }

      gl[name](index, value);
    };
  }

  function pointerSetter(index) {
    return function (attrData) {
      // Valores por defecto
      var type = attrData.type || fre.gl.Variable.getGLTypeByTypedArray(gl, TypedArray);
      var normalized = attrData.normalized || false;
      var stride = attrData.stride || 0;
      var offset = attrData.offset || 0;

      gl.bindBuffer(attrData.buffer.target, attrData.buffer.webGLBuffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, attrData.size, type, normalized, stride, offset);
    }
  }
};

fre.gl.Attribute.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Attribute.prototype.constructor = fre.gl.Attribute;

module.exports = fre.gl.Attribute;
