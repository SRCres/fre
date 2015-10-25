'use strict';

var fre = require('../fre');

/**
 * Representa un programa.
 * @constructor
 * @param  {WebGLShader|String[]|HTMLScriptElement} shaders Fuentes de los shaders.
 */
fre.gl.Program = function (shadersSources) {
  var program = createProgram.call(this);
  this.attributes = new fre.gl.AttributesCollection(program);
  this.uniforms = new fre.gl.UniformsCollection(program);
  this.webGLProgram = program;

  function createProgram() {
    this.shaders = [];

    for (var i = 0; i < shadersSources.length; i++) {
      var source = shadersSources[i];
      var type = fre.gl.Shader.types[i];
      var shader;

      if (source instanceof fre.gl.Shader) {
        shader = source;
      } else if (typeof source == 'string') {
        shader = new fre.gl.Shader(source, type);
      } else {
        shader = new fre.gl.Shader(source);
      }

      if (!shader) {
        return null;
      }

      this.shaders.push(shader);
    }

    // Crea el programa
    var program = fre.gl.context.createProgram();

    // Adjunta los shaders al programa
    this.shaders.forEach(function (shader) {
      fre.gl.context.attachShader(program, shader.webGLShader);
    });

    // Vincula el programa
    fre.gl.context.linkProgram(program);

    // Verifica el estado del vínculo
    var linked = fre.gl.context.getProgramParameter(program, fre.gl.context.LINK_STATUS);
    if (!linked) {
      // Algo salió mal y obtiene el error
      var log = fre.gl.context.getProgramInfoLog(program);
      fre.error('Error al vincular el programa: ' + log);

      // Elimina el programa
      fre.gl.context.deleteProgram(program);

      return null;
    }

    return program;
  }
};

module.exports = fre.gl.Program;
