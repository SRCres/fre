'use strict';

var fre = require('../fre');

/**
 * Representa un shader.
 * @constructor
 * @param {String|HTMLScriptElement} source Fuente del shader.
 * @param {Number} [type] Tipo de shader.
 */
fre.gl.Shader = function (source, type) {
  if (source instanceof HTMLScriptElement) {
    this.webGLShader = createShaderWithScript(source, type);
  } else {
    this.webGLShader = createShader(source, type);
  }

  function createShader(source, type) {
    // Crea el shader
    var shader = fre.gl.context.createShader(type);

    // Verifica la creación
    if (!shader) {
      fre.error('Incapaz de crear el shader.');
      return null;
    }

    // Carga la fuente del shader
    fre.gl.context.shaderSource(shader, source);

    // Compila el shader
    fre.gl.context.compileShader(shader);

    // Verifica el estado de la compilación
    var compiled = fre.gl.context.getShaderParameter(shader, fre.gl.context.COMPILE_STATUS);
    if (!compiled) {
      // Algo salió mal y obtiene el error
      var log = fre.gl.context.getShaderInfoLog(shader, fre.gl.context.COMPILE_STATUS);
      fre.error('Error al compilar el shader: ' + log);

      // Elimina el shader
      fre.gl.context.deleteShader(shader);

      return null;
    }

    return shader;
  }

  function createShaderWithScript(script, type) {
    // ¿Existe el script?
    if (!script) {
      fre.error('Error: elemento script desconocido.');
      return null;
    }

    var source = script.text;

    // Verifica si se pasó un tipo de shader
    if (!type) {
      // No se pasó ningún tipo y usa el tipo definido en el script
      if (script.type == 'x-shader/x-vertex') {
        type = fre.gl.context.VERTEX_SHADER;
      }

      if (script.type == 'x-shader/x-fragment') {
        type = fre.gl.context.FRAGMENT_SHADER;
      }
    }

    // Verifica si es un tipo conocido
    if (type !== fre.gl.context.VERTEX_SHADER && type !== fre.gl.context.FRAGMENT_SHADER) {
      fre.error('Error: tipo de shader desconocido.');
      return null;
    }

    return createShader(source, type);
  }
};

fre.gl.Shader.FRAGMENT_SHADER = 0x8B30;
fre.gl.Shader.VERTEX_SHADER = 0x8B31;
fre.gl.Shader.types = [fre.gl.Shader.VERTEX_SHADER, fre.gl.Shader.FRAGMENT_SHADER];

module.exports = fre.gl.Shader;
