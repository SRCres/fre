'use strict';

/**
 * Representa una variable
 * @constructor
 * @param {WebGLRenderingContext} gl Contexto de renderizado WebGL.
 * @param {WebGLActiveInfo} info Información de la variable.
 */
fre.gl.Variable = function (info) {
  this.name = info.name;
  this.type = info.type;
  this.size = info.size;
};

/**
 * Array tipado por tipo de dato.
 * @param  {Number} type Tipo de dato.
 * @return {Function} Constructor de un array tipado. Si el tipo
 * de dato es desconocido retorna null.
 */
fre.gl.Variable.getTypedArrayByType = function (type) {
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
 * @param  {String} prefix Prefijo del calificador.
 * @param  {Number} type Tipo de dato.
 * @return {String} Sufijo. Si el tipo de dato es desconocido
 * retorna un string vacío.
 */
fre.gl.Variable.getSetterNameByType = function (prefix, type) {
  var context = fre.gl.context;

  if (type == context.FLOAT) {
    return prefix + '1fv';
  }

  if (type == context.FLOAT_VEC2) {
    return prefix + '2fv';
  }

  if (type == context.FLOAT_VEC3) {
    return prefix + '3fv';
  }

  if (type == context.FLOAT_VEC4) {
    return prefix + '4fv';
  }

  if (type == context.INT) {
    return prefix + '1iv';
  }

  if (type == context.INT_VEC2) {
    return prefix + '2iv';
  }

  if (type == context.INT_VEC3) {
    return prefix + '3iv';
  }

  if (type == context.INT_VEC4) {
    return prefix + '4iv';
  }

  if (type == context.BOOL) {
    return prefix + '1iv';
  }

  if (type == context.BOOL_VEC2) {
    return prefix + '2iv';
  }

  if (type == context.BOOL_VEC3) {
    return prefix + '3iv';
  }

  if (type == context.BOOL_VEC4) {
    return prefix + '4iv';
  }

  if (type == context.FLOAT_MAT2) {
    return prefix + 'Matrix2fv';
  }

  if (type == context.FLOAT_MAT3) {
    return prefix + 'Matrix3fv';
  }

  if (type == context.FLOAT_MAT4) {
    return prefix + 'Matrix4fv';
  }

  fre.error('Error: tipo desconocido 0x' + type.toString(16));
  return '';
};

module.exports = fre.gl.Variable;
