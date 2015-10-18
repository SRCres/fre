'use strict';

/**
 * Representa una variable
 * @constructor
 * @param {WebGLRenderingContext} gl Contexto de renderizado WebGL.
 * @param {WebGLActiveInfo} info Información de la variable.
 */
fre.gl.Variable = function (info) {
  this.info = info;
};

/**
 * Array tipado por tipo.
 * @param  {Number} type Tipo de dato.
 * @return {Function} Constructor de un array tipado. Si el tipo
 * de dato es desconocido retorna null.
 */
fre.gl.Variable.prototype.getTypedArrayByType = function (type) {
  var context = fre.gl.context;

  if (type == context.BYTE) {
    return Int8Array;
  }

  if (type == context.UNSIGNED_BYTE || type == context.BOOL ||
      type == context.BOOL_VEC2 || type == context.BOOL_VEC3 ||
      type == context.BOOL_VEC4) {
    return Uint8Array;
  }

  if (type == context.SHORT) {
    return Int16Array;
  }

  if (type == context.UNSIGNED_SHORT) {
    return Uint16Array;
  }

  if (type == context.INT || type == context.INT_VEC2 ||
      type == context.INT_VEC3 || type == context.INT_VEC4) {
    return Int32Array;
  }

  if (type == context.UNSIGNED_INT) {
    return Uint32Array;
  }

  if (type == context.FLOAT || type == context.FLOAT_VEC2 ||
      type == context.FLOAT_VEC3 || type == context.FLOAT_VEC4 ||
      type == context.FLOAT_MAT2 || type == context.FLOAT_MAT3 ||
      type == context.FLOAT_MAT4) {
    return Float32Array;
  }

  return null;
};

/**
 * Sufijo por tipo de dato.
 * @param  {Number} type Tipo de dato.
 * @return {String} Sufijo. Si el tipo de dato es desconocido
 * retorna un string vacío.
 */
fre.gl.Variable.prototype.suffixByType = function (type) {
  var context = fre.gl.context;

  if (type == context.FLOAT) {
    return '1fv';
  }

  if (type == context.FLOAT_VEC2) {
    return '2fv';
  }

  if (type == context.FLOAT_VEC3) {
    return '3fv';
  }

  if (type == context.FLOAT_VEC4) {
    return '4fv';
  }

  if (type == context.INT) {
    return '1iv';
  }

  if (type == context.INT_VEC2) {
    return '2iv';
  }

  if (type == context.INT_VEC3) {
    return '3iv';
  }

  if (type == context.INT_VEC4) {
    return '4iv';
  }

  if (type == context.BOOL) {
    return '1iv';
  }

  if (type == context.BOOL_VEC2) {
    return '2iv';
  }

  if (type == context.BOOL_VEC3) {
    return '3iv';
  }

  if (type == context.BOOL_VEC4) {
    return '4iv';
  }

  if (type == context.FLOAT_MAT2) {
    return 'Matrix2fv';
  }

  if (type == context.FLOAT_MAT3) {
    return 'Matrix3fv';
  }

  if (type == context.FLOAT_MAT4) {
    return 'Matrix4fv';
  }

  fre.error('Error: tipo desconocido 0x' + type.toString(16));
  return '';
};

module.exports = fre.gl.Variable;
