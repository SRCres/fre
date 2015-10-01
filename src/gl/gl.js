'use strict';

fre = require('../fre');

var FRAGMENT_SHADER = 0x8B30;
var VERTEX_SHADER = 0x8B31;

fre.gl = {
  shaderTypes: [VERTEX_SHADER, FRAGMENT_SHADER],

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
   * Crea un programa con fuentes.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {String[]} sources Fuentes de los shaders.
   * @param  {Function} errorCallback Callback para errores.
   * @return {WebGLProgram} Programa creado. Si falla retorna null.
   */
  createProgramWithSources: function (gl, sources, errorCallback) {
    var shaders = [];

    for (var i = 0; i < sources.length; i++) {
      var shader = this.createShader(gl, sources[i], this.shaderTypes[i], errorCallback);

      if (!shader) {
        return null;
      }

      shaders.push(shader);
    }

    return this.createProgram(gl, shaders, errorCallback);
  },

  /**
   * Crea un program con elementos scripts.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {String[]} ids Ids de los elementos script.
   * @param  {Function} [errorCallback] Callback para errores.
   * @return {WebGLProgram} Programa creado. Si falla retorna null.
   */
  createProgramWithScripts: function (gl, ids, errorCallback) {
    var shaders = [];

    for (var i = 0; i < ids.length; i++) {
      var shader = this.createShaderWithScript(gl, ids[i], errorCallback);

      if (!shader) {
        return null;
      }

      shaders.push(shader);
    }

    return this.createProgram(gl, shaders, errorCallback);
  },

  /**
   * Crea un programa.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {WebGLShader[]} shaders Shaders para adjuntar.
   * @param  {Function} [errorCallback] Callback para errores.
   * @return {WebGLProgram} Programa creado. Si falla retorna null.
   */
  createProgram: function (gl, shaders, errorCallback) {
    var errorFn = errorCallback || fre.error;

    // Crea el programa
    var program = gl.createProgram();

    // Adjunta los shaders al programa
    shaders.forEach(function (shader) {
      gl.attachShader(program, shader);
    });

    // Vincula el programa
    gl.linkProgram(program);

    // Verifica el estado del vínculo
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // Algo salió mal y obtiene el error
      var log = gl.getProgramInfoLog(program);
      errFn('Error al vincular el programa: ' + log);

      // Elimina el programa
      gl.deleteProgram(program);

      return null;
    }

    return program;
  },

  /**
   * Crea un shader con un elemento script.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {String} id El id del elemento script.
   * @param  {Number} [type] Tipo de shader a ser creado.
   * @param  {Function} [errorCallback] Callback para errores.
   * @return {WebGLShader} Shader creado. Si falla retorna null.
   */
  createShaderWithScript: function (gl, id, type, errorCallback) {
    var errorFn = errorCallback || fre.error;

    if (typeof type == 'function') {
      errorCallback = type;
      type = undefined;
    }

    // Obtiene el elemento script del shader
    var script = document.getElementById(id);

    // ¿Existe el script?
    if (!script) {
      errorFn('Error: elemento script desconocido.');
      return null;
    }

    var source = script.text;

    // Verifica si se pasó un tipo de shader
    if (!type) {
      // No se pasó ningún tipo y usa el tipo definido en el script
      if (script.type == 'x-shader/x-vertex') {
        type = gl.VERTEX_SHADER;
      }

      if (script.type == 'x-shader/x-fragment') {
        type = gl.FRAGMENT_SHADER;
      }
    }

    // Verifica si es un tipo conocido
    if (type !== gl.VERTEX_SHADER && type !== gl.FRAGMENT_SHADER) {
      errorFn('Error: tipo de shader desconocido.');
      return null;
    }

    return this.createShader(gl, source, type, errorCallback);
  },

  /**
   * Crea un shader.
   * @param  {WebGLRenderingContext} gl Contexto de renderizado WebGL.
   * @param  {String} source Fuente del shader.
   * @param  {Number} type Tipo de shader a ser creado.
   * @param  {Function} [errorCallback] Callback para errores.
   * @return {WebGLShader} Shader creado. Si falla retorna null.
   */
  createShader: function (gl, source, type, errorCallback) {
    var errorFn = errorCallback || fre.error;

    // Crea el shader
    var shader = gl.createShader(type);

    // Verifica la creación
    if (!shader) {
      errorFn('Incapaz de crear el shader.');
      return null;
    }

    // Carga la fuente del shader
    gl.shaderSource(shader, source);

    // Compila el shader
    gl.compileShader(shader);

    // Verifica el estado de la compilación
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Algo salió mal y obtiene el error
      var log = gl.getShaderInfoLog(shader, gl.COMPILE_STATUS);
      errorFn('Error al compilar el shader: ' + log);

      // Elimina el shader
      gl.deleteShader(shader);

      return null;
    }

    return shader;
  }
};
