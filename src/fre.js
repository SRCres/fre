'use strict';

window.fre = {
  version: '0.0.1',
  error: window.console && window.console.error ? window.console.error.bind(window.console) : function () { }
};

module.exports = window.fre;

// loaders
require('./loader/loader');

// math
require('./math/math');

// gl
require('./gl/gl');
