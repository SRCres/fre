'use strict';

/**
 * Representa una variable con calificador uniform.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLRenderingContext} gl Context de renderizado WebGL.
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del uniform.
 */
fre.gl.Uniform = function (gl, program, info) {
  fre.gl.Variable.call(this, info);

  var setterName = fre.gl.Variable.getSetterNameByType(gl, 'uniform', info.type);

  if (!setterName) {
    return null;
  }

  var TypedArray = fre.gl.Variable.getTypedArrayByType(gl, info.type);

  this.location = gl.getUniformLocation(program, info.name);
  this.set = setter(setterName, this.location, TypedArray);

  function setter(name, location, TypedArray) {
    if (/^uniformMatrix[2-4][fi]v$/.test(name)) {
      return function (value, transpose) {
        if (TypedArray) {
          value = new TypedArray(value);
        }

        gl[name](location, transpose, value);
      };
    }

    return function (value) {
      if (TypedArray) {
        value = new TypedArray(value);
      }

      gl[name](location, value);
    };
  }
};

fre.gl.Uniform.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Uniform.prototype.constructor = fre.gl.Uniform;

module.exports = fre.gl.Uniform;
