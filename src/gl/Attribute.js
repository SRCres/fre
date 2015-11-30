'use strict';

/**
 * Representa una variable con calificador attribute.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del attribute.
 */
fre.gl.Attribute = function (program, info) {
  fre.gl.Variable.call(this, info);

  var setterName = fre.gl.Variable.getSetterNameByType('vertexAttrib', info.type);

  if (!setterName) {
    return null;
  }

  var TypedArray = fre.gl.Variable.getTypedArrayByType(info.type);

  this.index = fre.gl.context.getAttribLocation(program, info.name);
  this.set = setter(setterName, this.index, TypedArray);
  this.setPointer = pointerSetter(this.index);

  function setter(name, index, TypedArray) {
    return function (value) {
      if (TypedArray) {
        value = new TypedArray(value);
      }

      fre.gl.context[name](index, value);
    };
  }

  function pointerSetter(index) {
    return function (attrData) {
      // Valores por defecto
      var type = attrData.type || fre.gl.Variable.getGLTypeByTypedArray(TypedArray);
      var normalized = attrData.normalized || false;
      var stride = attrData.stride || 0;
      var offset = attrData.offset || 0;

      fre.gl.context.bindBuffer(attrData.buffer.target, attrData.buffer.webGLBuffer);
      fre.gl.context.enableVertexAttribArray(index);
      fre.gl.context.vertexAttribPointer(index, attrData.size, type, normalized, stride, offset);
    }
  }
};

fre.gl.Attribute.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Attribute.prototype.constructor = fre.gl.Attribute;

module.exports = fre.gl.Attribute;
