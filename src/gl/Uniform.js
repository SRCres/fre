'use strict';

/**
 * Representa una variable con calificador uniform.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del uniform.
 */
fre.gl.Uniform = function (program, info) {
  fre.gl.Variable.call(this, info);

  var setterName = fre.gl.getSetterNameByType('uniform', info.type);

  if (!setterName) {
    return null;
  }

  var TypedArray = fre.gl.getTypedArrayByType(info.type);

  this.location = fre.gl.context.getUniformLocation(program, info.name);
  this.set = setter(setterName, this.location, TypedArray);

  function setter(name, location, TypedArray) {
    if (/^uniformMatrix[2-4][fi]v$/.test(name)) {
      return function (value, transpose) {
        if (TypedArray) {
          value = new TypedArray(value);
        }

        fre.gl.context[name](location, transpose, value);
      };
    }

    return function (value) {
      if (TypedArray) {
        value = new TypedArray(value);
      }

      fre.gl.context[name](location, value);
    };
  }
};

fre.gl.Uniform.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Uniform.prototype.constructor = fre.gl.Uniform;

module.exports = fre.gl.Uniform;
