'use strict';

fre = require('../fre');

fre.gl = {
  /**
   * Obtiene un contexto WebGL y lo retorna.
   *
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
  }
};

module.exports = fre.gl;

require('./Variable');
require('./Attribute');
require('./Uniform');
require('./AttributesCollection');
require('./UniformsCollection');
require('./Buffer');
require('./Program');
require('./Shader');
