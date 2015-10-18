'use strict';

/**
 * Representa una variable con calificador uniform.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del uniform.
 */
fre.gl.Uniform = function (program, info) {
  var setterSuffix = this.suffixByType(info.type);
  var TypedArray = this.getTypedArrayByType(info.type);

  if (!setterSuffix) {
    return null;
  }

  var setterName = 'uniform' + setterSuffix;

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

  fre.gl.Variable.call(this, info);
};

fre.gl.Uniform.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Uniform.prototype.constructor = fre.gl.Uniform;

module.exports = fre.gl.Uniform;
