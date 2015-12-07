'use strict';

var fre = require('../fre');

/**
 * Representa un programa.
 * @constructor
 * @param {WebGLRenderingContext} gl Context de renderizado WebGL.
 * @param  {WebGLShader|String[]|HTMLScriptElement} shaders Fuentes de los shaders.
 */
fre.gl.Program = function (gl, shadersSources) {
  var program = createProgram.call(this);
  this.attributes = new fre.gl.AttributesCollection(gl, program);
  this.uniforms = new fre.gl.UniformsCollection(gl, program);
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
        shader = new fre.gl.Shader(gl, source, type);
      } else {
        shader = new fre.gl.Shader(gl, source);
      }

      if (!shader) {
        return null;
      }

      this.shaders.push(shader);
    }

    // Crea el programa
    var program = gl.createProgram();

    // Adjunta los shaders al programa
    this.shaders.forEach(function (shader) {
      gl.attachShader(program, shader.webGLShader);
    });

    // Vincula el programa
    gl.linkProgram(program);

    // Verifica el estado del vínculo
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // Algo salió mal y obtiene el error
      var log = gl.getProgramInfoLog(program);
      fre.error('Error al vincular el programa: ' + log);

      // Elimina el programa
      gl.deleteProgram(program);

      return null;
    }

    return program;
  }
};

module.exports = fre.gl.Program;
