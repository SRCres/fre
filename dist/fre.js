(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

window.fre = { version: '0.0.1' };

module.exports = window.fre;

/**
 * @todo Mejorar el punto de entrada para no tener
 * que requerir todos los archivos aquí.
 **/
require('./renderer/WebGLRenderer');
},{"./renderer/WebGLRenderer":2}],2:[function(require,module,exports){
var fre = require('../fre.js');

"use strict";

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
},{"../fre.js":1}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJlLmpzIiwic3JjL3JlbmRlcmVyL1dlYkdMUmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxud2luZG93LmZyZSA9IHsgdmVyc2lvbjogJzAuMC4xJyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5mcmU7XG5cbi8qKlxuICogQHRvZG8gTWVqb3JhciBlbCBwdW50byBkZSBlbnRyYWRhIHBhcmEgbm8gdGVuZXJcbiAqIHF1ZSByZXF1ZXJpciB0b2RvcyBsb3MgYXJjaGl2b3MgYXF1w60uXG4gKiovXG5yZXF1aXJlKCcuL3JlbmRlcmVyL1dlYkdMUmVuZGVyZXInKTsiLCJ2YXIgZnJlID0gcmVxdWlyZSgnLi4vZnJlLmpzJyk7XG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE9idGllbmUgdW4gY29udGV4dG8gV2ViR0wgeSBsbyByZXRvcm5hLlxuICogQHBhcmFtICB7SFRNTENhbnZhc0VsZW1lbnR9IGVsZW1lbnQgRWxlbWVudG8gY2FudmFzLlxuICogQHBhcmFtICB7T2JqZWN0fSBhdHRycyBBdHJpYnV0b3MgZGVsIGNvbnRleHRvLlxuICogQHJldHVybiB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBDb250ZXh0byBkZSByZW5kZXJpemFkb1xuICogV2ViR0wuIFNpIGVsIG5hdmVnYWRvciBubyBsbyBzb3BvcnRhIHJldG9ybmEgbnVsbC5cbiAqL1xuZnJlLldlYkdMUmVuZGVyZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cnMpIHtcbiAgdmFyIGNvbnRleHQgPSBudWxsO1xuXG4gIC8qKiBAdG9kbyBDcmVhciB1biBlbGVtZW50byBjYW52YXMgbyByZWNpYmlyIHVubz8gKi9cblxuICB0cnkge1xuICAgIGNvbnRleHQgPSBlbGVtZW50LmdldENvbnRleHQoJ3dlYmdsJywgYXR0cnMpIHx8XG4gICAgICAgICAgICAgIGVsZW1lbnQuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJywgYXR0cnMpO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIGlmICghY29udGV4dCkge1xuICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gJ05vIHNlIHB1ZWRlIGluaWNpYWxpemFyIFdlYkdMLiBUdSBuYXZlZ2Fkb3Igbm8gZXMgY29tcGF0aWJsZS4nO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59OyJdfQ==
