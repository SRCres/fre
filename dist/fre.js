(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.fre = { version: '0.0.1' };

module.exports = window.fre;

/**
 * @todo Mejorar el punto de entrada para no tener
 * que requerir todos los archivos aquí.
 **/
require('./renderer/WebGLRenderer');
},{"./renderer/WebGLRenderer":2}],2:[function(require,module,exports){
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
},{"../fre.js":1}]},{},[1]);
