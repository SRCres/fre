'use strict';

window.fre = {
  version: '0.0.1',
  error: window.console && window.console.error ? window.console.error.bind(window.console) : function () { }
};

module.exports = window.fre;

/**
 * @todo Mejorar el punto de entrada para no tener
 * que requerir todos los archivos aquí.
 **/

// loaders
require('./loaders/ajax');

// gl
require('./gl/gl');
