var fre = require('../fre.js');

'use strict';

/**
 * Obtiene un contexto WebGL y lo retorna.
 * @param  {HTMLCanvasElement} element Elemento canvas.
 * @param  {Object} attrs Atributos del contexto.
 * @return {WebGLRenderingContext} Contexto de renderizado
 * WebGL. Si el navegador no lo soporta retorna null.
 */
fre.WebGLRenderer = function (element, attrs) {
  var context = null;

  /** @todo Crear un elemento canvas o recibir uno? */

  try {
    context = element.getContext('webgl', attrs) ||
              element.getContext('experimental-webgl', attrs);
  } catch (e) {}

  if (!context) {
    element.innerText = 'No se puede inicializar WebGL. Tu navegador no es compatible.';
  }

  return context;
};