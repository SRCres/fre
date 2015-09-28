(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.fre = { version: '0.0.1' };

module.exports = window.fre;

/**
 * @todo Mejorar el punto de entrada para no tener
 * que requerir todos los archivos aquí.
 **/
require('./gl/gl');

},{"./gl/gl":2}],2:[function(require,module,exports){
fre = require('../fre');

'use strict';

fre.gl = {
  /**
   * Obtiene un contexto WebGL y lo retorna.
   * @param  {HTMLCanvasElement} canvas Elemento canvas.
   * @param  {Object} attrs Atributos del contexto.
   * @return {WebGLRenderingContext} Contexto de renderizado
   * WebGL. Si el navegador no lo soporta retorna null.
   */
  getWebGLContext: function (canvas, attrs) {
    var context = null;

    try {
      context = canvas.getContext('webgl', attrs) ||
                canvas.getContext('experimental-webgl', attrs);
    } catch (e) {}

    if (!context) {
      canvas.innerText = 'No se puede inicializar WebGL. Tu navegador no es compatible.';
    }

    return context;
  },

  /**
   * Crea un objeto programa y lo usa.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {String} vertShaderSource Código fuente del vertex shader.
   * @param  {String} fragShaderSource Código fuente del fragment shader.
   * @return {WebGLProgram} Objeto programa. Si el programa no se creó
   * o no se pudo usar retorna false.
   */
  initProgram: function (gl, vertShaderSource, fragShaderSource) {
    var program = this.createProgram(gl, vertShaderSource, fragShaderSource);
    if (!program) {
      console.log('Error al crear el programa.');
      return false;
    }

    gl.useProgram(program);

    return program;
  },

  /**
   * Crea un objeto programa enlazado.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {String} vertShaderSource Código fuente del vertex shader.
   * @param  {String} fragShaderSource Código fuente del fragment shader.
   * @return {WebGLProgram} Objeto programa. Si falla la creación
   * retorna null.
   */
  createProgram: function (gl, vertShaderSource, fragShaderSource) {
    var vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertShaderSource),
        fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
    if (!vertexShader || !fragmentShader) {
      return null;
    }

    var program = gl.createProgram();
    if (!program) {
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.log('Error al enlazar programa: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }

    return program;
  },

  /**
   * Crea un objeto shader
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {Constant} type El tipo de objeto shader a ser creado.
   * @param  {String} source Código fuente del shader.
   * @return {WebGLShader} Objeto shader. Si falla la creación
   * retorna null.
   */
  createShader: function (gl, type, source) {
    var shader = gl.createShader(type);

    if (!shader) {
      console.log('Incapaz de crear shader.');
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      console.log('Error al compilar shader: ' + error);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
};

},{"../fre":1}]},{},[1]);
