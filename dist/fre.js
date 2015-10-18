(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./gl/gl":9,"./loaders/ajax":10}],2:[function(require,module,exports){
'use strict';

/**
 * Representa una variable con calificador attribute.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del attribute.
 */
fre.gl.Attribute = function (program, info) {
  var setterSuffix = this.suffixByType(info.type);
  var TypedArray = this.getTypedArrayByType(info.type);

  if (!setterSuffix) {
    return null;
  }

  var setterName = 'vertexAttrib' + setterSuffix;

  this.index = fre.gl.context.getAttribLocation(program, info.name);
  this.set = setter(setterName, this.index, TypedArray);
  this.setPointer = pointerSetter(this.index);

  function setter(name, index, TypedArray) {
    return function (value) {
      if (TypedArray) {
        value = new TypedArray(value);
      }

      fre.gl.context[name](index, value);
    };
  }

  function pointerSetter(index) {
    return function (buffer, size, type, normalized, stride, offset) {
      // Valores por defecto
      type = type || fre.gl.context.FLOAT;
      normalized = normalized || false;
      stride = stride || 0;
      offset = offset || 0;

      fre.gl.context.bindBuffer(fre.gl.context.ARRAY_BUFFER, buffer);
      fre.gl.context.enableVertexAttribArray(index);
      fre.gl.context.vertexAttribPointer(index, size, type, normalized, stride, offset);
    }
  }

  fre.gl.Variable.call(this, info);
};

fre.gl.Attribute.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Attribute.prototype.constructor = fre.gl.Attributes;

module.exports = fre.gl.Attributes;

},{}],3:[function(require,module,exports){
'use strict';

/**
 * Representa un mapa de variables attribute.
 * @constructor
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.AttributesMap = function (program) {
  var num = fre.gl.context.getProgramParameter(program, fre.gl.context.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < num; i++) {
    var info = fre.gl.context.getActiveAttrib(program, i);
    if (!info) {
      break;
    }

    var attribute = new fre.gl.Attribute(program, info);
    this[info.name] = attribute;
  }
};

module.exports = fre.gl.AttributesMap;

},{}],4:[function(require,module,exports){
'use strict';

var fre = require('../fre');

/**
 * Representa un programa.
 * @constructor
 * @param  {WebGLShader, String[]|HTMLScriptElement} shaders Fuentes de los shaders.
 */
fre.gl.Program = function (shadersSources) {
  var program = createProgram.call(this);
  this.attributes = new fre.gl.AttributesMap(program);
  this.uniforms = new fre.gl.UniformsMap(program);
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

},{"../fre":1}],5:[function(require,module,exports){
'use strict';

var fre = require('../fre');

/**
 * Representa un shader.
 * @constructor
 * @param {String|HTMLScriptElement} source Fuente del shader.
 * @param {Number} [type] Tipo de shader.
 */
fre.gl.Shader = function (source, type) {
  if (source instanceof HTMLScriptElement) {
    this.webGLShader = createShaderWithScript(source, type);
  } else {
    this.webGLShader = createShader(source, type);
  }

  function createShader(source, type) {
    // Crea el shader
    var shader = fre.gl.context.createShader(type);

    // Verifica la creación
    if (!shader) {
      fre.error('Incapaz de crear el shader.');
      return null;
    }

    // Carga la fuente del shader
    fre.gl.context.shaderSource(shader, source);

    // Compila el shader
    fre.gl.context.compileShader(shader);

    // Verifica el estado de la compilación
    var compiled = fre.gl.context.getShaderParameter(shader, fre.gl.context.COMPILE_STATUS);
    if (!compiled) {
      // Algo salió mal y obtiene el error
      var log = fre.gl.context.getShaderInfoLog(shader, fre.gl.context.COMPILE_STATUS);
      fre.error('Error al compilar el shader: ' + log);

      // Elimina el shader
      fre.gl.context.deleteShader(shader);

      return null;
    }

    return shader;
  }

  function createShaderWithScript(script, type) {
    // ¿Existe el script?
    if (!script) {
      fre.error('Error: elemento script desconocido.');
      return null;
    }

    var source = script.text;

    // Verifica si se pasó un tipo de shader
    if (!type) {
      // No se pasó ningún tipo y usa el tipo definido en el script
      if (script.type == 'x-shader/x-vertex') {
        type = fre.gl.context.VERTEX_SHADER;
      }

      if (script.type == 'x-shader/x-fragment') {
        type = fre.gl.context.FRAGMENT_SHADER;
      }
    }

    // Verifica si es un tipo conocido
    if (type !== fre.gl.context.VERTEX_SHADER && type !== fre.gl.context.FRAGMENT_SHADER) {
      fre.error('Error: tipo de shader desconocido.');
      return null;
    }

    return createShader(source, type);
  }
};

fre.gl.Shader.FRAGMENT_SHADER = 0x8B30;
fre.gl.Shader.VERTEX_SHADER = 0x8B31;
fre.gl.Shader.types = [fre.gl.Shader.VERTEX_SHADER, fre.gl.Shader.FRAGMENT_SHADER];

module.exports = fre.gl.Shader;

},{"../fre":1}],6:[function(require,module,exports){
'use strict';

/**
 * Representa una variable con calificador uniform.
 * @constructor
 * @augments {fre.gl.Variable}
 * @param {WebGLProgram} program Programa WebGL.
 * @param {WebGLActiveInfo} info Información del uniform.
 */
fre.gl.Uniform = function (program, info) {
  var setterSuffix = this.suffixByType(info.type);
  var TypedArray = this.getTypedArrayByType(info.type);

  if (!setterSuffix) {
    return null;
  }

  var setterName = 'uniform' + setterSuffix;

  this.location = fre.gl.context.getUniformLocation(program, info.name);
  this.set = setter(setterName, this.location, TypedArray);

  function setter(name, location, TypedArray) {
    if (/^uniformMatrix[2-4][fi]v$/.test(name)) {
      return function (value, transpose) {
        if (TypedArray) {
          value = new TypedArray(value);
        }

        fre.gl.context[name](location, transpose, value);
      };
    }

    return function (value) {
      if (TypedArray) {
        value = new TypedArray(value);
      }

      fre.gl.context[name](location, value);
    };
  }

  fre.gl.Variable.call(this, info);
};

fre.gl.Uniform.prototype = Object.create(fre.gl.Variable.prototype);
fre.gl.Uniform.prototype.constructor = fre.gl.Uniform;

module.exports = fre.gl.Uniform;

},{}],7:[function(require,module,exports){
'use strict';

/**
 * Representa un mapa de variables uniform.
 * @constructor
 * @param {WebGLProgram} program Programa WebGL.
 */
fre.gl.UniformsMap = function (program) {
  var num = fre.gl.context.getProgramParameter(program, fre.gl.context.ACTIVE_UNIFORMS);
  for (var i = 0; i < num; i++) {
    var info = fre.gl.context.getActiveUniform(program, i);
    if (!info) {
      break;
    }
    var name = info.name;
    // Quita el sufijo de array
    if (name.substr(-3) === "[0]") {
      name = name.substr(0, name.length - 3);
    }

    var uniform = new fre.gl.Uniform(program, info);
    this[name] = uniform;
  }
};

module.exports = fre.gl.UniformsMap;

},{}],8:[function(require,module,exports){
'use strict';

/**
 * Representa una variable
 * @constructor
 * @param {WebGLRenderingContext} gl Contexto de renderizado WebGL.
 * @param {WebGLActiveInfo} info Información de la variable.
 */
fre.gl.Variable = function (info) {
  this.info = info;
};

/**
 * Array tipado por tipo.
 * @param  {Number} type Tipo de dato.
 * @return {Function} Constructor de un array tipado. Si el tipo
 * de dato es desconocido retorna null.
 */
fre.gl.Variable.prototype.getTypedArrayByType = function (type) {
  var context = fre.gl.context;

  if (type == context.BYTE) {
    return Int8Array;
  }

  if (type == context.UNSIGNED_BYTE || type == context.BOOL ||
      type == context.BOOL_VEC2 || type == context.BOOL_VEC3 ||
      type == context.BOOL_VEC4) {
    return Uint8Array;
  }

  if (type == context.SHORT) {
    return Int16Array;
  }

  if (type == context.UNSIGNED_SHORT) {
    return Uint16Array;
  }

  if (type == context.INT || type == context.INT_VEC2 ||
      type == context.INT_VEC3 || type == context.INT_VEC4) {
    return Int32Array;
  }

  if (type == context.UNSIGNED_INT) {
    return Uint32Array;
  }

  if (type == context.FLOAT || type == context.FLOAT_VEC2 ||
      type == context.FLOAT_VEC3 || type == context.FLOAT_VEC4 ||
      type == context.FLOAT_MAT2 || type == context.FLOAT_MAT3 ||
      type == context.FLOAT_MAT4) {
    return Float32Array;
  }

  return null;
};

/**
 * Sufijo por tipo de dato.
 * @param  {Number} type Tipo de dato.
 * @return {String} Sufijo. Si el tipo de dato es desconocido
 * retorna un string vacío.
 */
fre.gl.Variable.prototype.suffixByType = function (type) {
  var context = fre.gl.context;

  if (type == context.FLOAT) {
    return '1fv';
  }

  if (type == context.FLOAT_VEC2) {
    return '2fv';
  }

  if (type == context.FLOAT_VEC3) {
    return '3fv';
  }

  if (type == context.FLOAT_VEC4) {
    return '4fv';
  }

  if (type == context.INT) {
    return '1iv';
  }

  if (type == context.INT_VEC2) {
    return '2iv';
  }

  if (type == context.INT_VEC3) {
    return '3iv';
  }

  if (type == context.INT_VEC4) {
    return '4iv';
  }

  if (type == context.BOOL) {
    return '1iv';
  }

  if (type == context.BOOL_VEC2) {
    return '2iv';
  }

  if (type == context.BOOL_VEC3) {
    return '3iv';
  }

  if (type == context.BOOL_VEC4) {
    return '4iv';
  }

  if (type == context.FLOAT_MAT2) {
    return 'Matrix2fv';
  }

  if (type == context.FLOAT_MAT3) {
    return 'Matrix3fv';
  }

  if (type == context.FLOAT_MAT4) {
    return 'Matrix4fv';
  }

  fre.error('Error: tipo desconocido 0x' + type.toString(16));
  return '';
};

module.exports = fre.gl.Variable;

},{}],9:[function(require,module,exports){
'use strict';

fre = require('../fre');

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

    this.context = context;

    return context;
  },

  initProgram: function (shaders) {
    return new gl.Program(shaders);
  }
};

module.exports = fre.gl;

require('./Variable');
require('./Attribute');
require('./Uniform');
require('./AttributesMap');
require('./UniformsMap');
require('./Program');
require('./Shader');

},{"../fre":1,"./Attribute":2,"./AttributesMap":3,"./Program":4,"./Shader":5,"./Uniform":6,"./UniformsMap":7,"./Variable":8}],10:[function(require,module,exports){
'use strict';

fre = require('../fre');

fre.ajax = function (url, loadCallback, progressCallback, errorCallback) {
  var xhr = new XMLHttpRequest();

  xhr.addEventListener('load', function (evt) {
    if (loadCallback) {
      loadCallback(evt, this);
    }
  }, false);

  if (progressCallback) {
    xhr.addEventListener('progress', function (evt) {
      progressCallback(evt);
    }, false);
  }

  if (errorCallback) {
    xhr.addEventListener('error', function (evt) {
      errorCallback(evt);
    }, false);
  }

  xhr.open('GET', url, true);

  xhr.send();

  return xhr;
};

},{"../fre":1}]},{},[1]);
