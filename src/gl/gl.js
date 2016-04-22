'use strict';

var gl = Object.create(null, {
  /**
   * Obtiene un contexto WebGL y lo retorna.
   * @param  {HTMLCanvasElement} canvas Elemento canvas.
   * @param  {Object} attrs Atributos del contexto.
   * @return {WebGLRenderingContext} Contexto de renderizado
   * WebGL. Si el navegador no lo soporta retorna null.
   */
  getWebGLContext: {
    value: function (canvas, attrs) {
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
    enumerable: true
  },

  /**
   * Crea un webGLShader por String o HTMLScriptElement y retorna un objeto
   * shader.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {String|HTMLScriptElement} source Fuente del shader.
   * @param  {Number} [type] Tipo de shader.
   * @return {Object} Objeto shader.
   */
  getShader: {
    value: function (webGL, source, type) {
      var webGLShader;

      if (source instanceof HTMLScriptElement) {
        webGLShader = fre.gl.createShaderWithScript(webGL, source, type);
      } else {
        webGLShader = fre.gl.createShader(webGL, source, type);
      }

      var shader = Object.create(fre.gl.shader);
      shader.webGLShader = webGLShader;

      return shader;
    },
    enumerable: true
  },

  /**
   * Crea un webGLShader y lo retorna.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {String} source Fuente del shader.
   * @param  {Number} type Tipo de shader.
   * @return {WebGLShader} Shader WebGL. Si no se pudo crear o compilar
   * retorna null.
   */
  createShader: {
    value: function (webGL, source, type) {
      // Crea el shader
      var webGLShader = webGL.createShader(type);

      // Verifica la creación
      if (!webGLShader) {
        fre.error('Incapaz de crear el webGLShader.');
        return null;
      }

      // Carga la fuente del shader
      webGL.shaderSource(webGLShader, source);

      // Compila el shader
      webGL.compileShader(webGLShader);

      // Verifica el estado de la compilación
      var compiled = webGL.getShaderParameter(webGLShader, webGL.COMPILE_STATUS);
      if (!compiled) {
        // Algo salió mal y obtiene el error
        var log = webGL.getShaderInfoLog(webGLShader, webGL.COMPILE_STATUS);
        fre.error('Error al compilar el webGLShader: ' + log);

        // Elimina el shader
        webGL.deleteShader(webGLShader);

        return null;
      }

      return webGLShader;
    },
    enumerable: true
  },

  /**
   * Crea un webGLShader por HTMLScriptElement y lo retorna.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {HTMLScriptElement} script Fuente del shader.
   * @param  {Number} type Tipo de shader.
   * @return {WebGLShader} Shader WebGL. Si no se pudo crear o compilar
   * retorna null.
   */
  createShaderWithScript: {
    value: function (webGL, script, type) {
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
          type = webGL.VERTEX_SHADER;
        }

        if (script.type == 'x-shader/x-fragment') {
          type = webGL.FRAGMENT_SHADER;
        }
      }

      // Verifica si es un tipo conocido
      if (type !== webGL.VERTEX_SHADER && type !== webGL.FRAGMENT_SHADER) {
        fre.error('Error: tipo de webGLShader desconocido.');
        return null;
      }

      return fre.gl.createShader(gl, source, type);
    },
    enumerable: true
  },

  /**
   * Crea un webGLProgram y retorna un objeto program.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {shader[]|String[]|HTMLScriptElement[]} shaders Fuentes de los
   * shaders.
   * @return {Object} Objeto program.
   */
  getProgram: {
    value: function (webGL, shadersSources) {
      var shaders = [];

      for (var i = 0; i < shadersSources.length; i++) {
        var source = shadersSources[i];
        var type = fre.gl.shader.types[i];
        var shader;

        if (typeof source == 'object') {
          shader = source;
        } else if (typeof source == 'string') {
          shader = fre.gl.getShader(webGL, source, type);
        } else {
          shader = fre.gl.getShader(webGL, source);
        }

        if (!shader) {
          return null;
        }

        shaders.push(shader);
      }

      var webGLProgram = fre.gl.createProgram(webGL, shaders);

      var program = Object.create(fre.gl.program);
      program.shaders = shaders;
      program.attributes = fre.gl.getAttributesCollection(webGL, webGLProgram);
      program.uniforms = fre.gl.getUniformsCollection(webGL, webGLProgram);
      program.webGLProgram = webGLProgram;

      return program;
    },
    enumerable: true
  },

  /**
   * Crea un webGLProgram y lo retorna.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {shaders[]} shaders Objetos shader.
   * @return {WebGLProgram} Programa WebGL. Si no se pudo vincular retorna null.
   */
  createProgram: {
    value: function (webGL, shaders) {
      // Crea el programa
      var webGLProgram = webGL.createProgram();

      // Adjunta los shaders al programa
      shaders.forEach(function (shader) {
        webGL.attachShader(webGLProgram, shader.webGLShader);
      });

      // Vincula el programa
      webGL.linkProgram(webGLProgram);

      // Verifica el estado del vínculo
      var linked = webGL.getProgramParameter(webGLProgram, webGL.LINK_STATUS);
      if (!linked) {
        // Algo salió mal y obtiene el error
        var log = webGL.getProgramInfoLog(webGLProgram);
        fre.error('Error al vincular el webGLProgram: ' + log);

        // Elimina el programa
        webGL.deleteProgram(webGLProgram);

        return null;
      }

      return webGLProgram;
    },
    enumerable: true
  },

  /**
   * Array tipado por tipo de dato.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {Number} type Tipo de dato.
   * @return {Function} Constructor de un array tipado. Si el tipo
   * de dato es desconocido retorna null.
   */
  getTypedArrayByType: {
    value: function (webGL, type) {
      var context = webGL;

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
    },
    enumerable: true
  },

  /**
   * Sufijo por tipo de dato.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {String} prefix Prefijo del calificador.
   * @param  {Number} type Tipo de dato.
   * @return {String} Sufijo. Si el tipo de dato es desconocido
   * retorna un string vacío.
   */
  getSetterNameByType: {
    value: function (webGL, prefix, type) {
      var context = webGL;

      if (type == context.FLOAT) {
        return prefix + '1fv';
      }

      if (type == context.FLOAT_VEC2) {
        return prefix + '2fv';
      }

      if (type == context.FLOAT_VEC3) {
        return prefix + '3fv';
      }

      if (type == context.FLOAT_VEC4) {
        return prefix + '4fv';
      }

      if (type == context.INT) {
        return prefix + '1iv';
      }

      if (type == context.INT_VEC2) {
        return prefix + '2iv';
      }

      if (type == context.INT_VEC3) {
        return prefix + '3iv';
      }

      if (type == context.INT_VEC4) {
        return prefix + '4iv';
      }

      if (type == context.BOOL) {
        return prefix + '1iv';
      }

      if (type == context.BOOL_VEC2) {
        return prefix + '2iv';
      }

      if (type == context.BOOL_VEC3) {
        return prefix + '3iv';
      }

      if (type == context.BOOL_VEC4) {
        return prefix + '4iv';
      }

      if (type == context.FLOAT_MAT2) {
        return prefix + 'Matrix2fv';
      }

      if (type == context.FLOAT_MAT3) {
        return prefix + 'Matrix3fv';
      }

      if (type == context.FLOAT_MAT4) {
        return prefix + 'Matrix4fv';
      }

      fre.error('Error: tipo desconocido 0x' + type.toString(16));
      return '';
    },
    enumerable: true
  },

  /**
   * Tipo de dato por array tipado.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {TypedArray} TypedArray Objeto de array tipado.
   * @return {Number} Tipo de dato. Si el array tipado
   * es desconocido retorna null.
   */
  getGLTypeByTypedArray: {
    value: function (webGL, TypedArray) {
      var context = webGL;

      if (TypedArray == Int8Array) {
        return context.BYTE;
      }

      if (TypedArray == Uint8Array) {
        return context.UNSIGNED_BYTE;
      }

      if (TypedArray == Int16Array) {
        return context.SHORT;
      }

      if (TypedArray == Uint16Array) {
        return context.UNSIGNED_SHORT;
      }

      if (TypedArray == Int32Array) {
        return context.INT;
      }

      if (TypedArray == Uint32Array) {
        return context.UNSIGNED_INT;
      }

      if (TypedArray == Float32Array) {
        return context.FLOAT;
      }

      return null;
    },
    enumerable: true
  },

  /**
   * Obtiene una variable con calificador attribute y retorna un objeto attribute.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {WebGLProgram} program Programa WebGL.
   * @param  {WebGLActiveInfo} info Información del attribute.
   * @return {Object} Objeto attribute.
   */
  getAttribute: {
    value: function (webGL, program, info) {
      var setterName = fre.gl.getSetterNameByType(webGL, 'vertexAttrib', info.type);

      if (!setterName) {
        return null;
      }

      var index = webGL.getAttribLocation(program, info.name);
      var TypedArray = fre.gl.getTypedArrayByType(webGL, info.type);

      var attribute = Object.create(fre.gl.attribute);
      attribute.name = info.name;
      attribute.type = info.type;
      attribute.size = info.size;
      attribute.index = index;
      attribute.set = setter(setterName, index, TypedArray);
      attribute.setPointer = pointerSetter(index);

      function setter(name, index, TypedArray) {
        return function (value) {
          if (TypedArray) {
            value = new TypedArray(value);
          }

          webGL[name](index, value);
        };
      }

      function pointerSetter(index) {
        return function (attrData) {
          // Valores por defecto
          var type = attrData.type ||
              fre.gl.getGLTypeByTypedArray(webGL, TypedArray);
          var normalized = attrData.normalized || false;
          var stride = attrData.stride || 0;
          var offset = attrData.offset || 0;

          webGL.bindBuffer(attrData.buffer.target, attrData.buffer.webGLBuffer);
          webGL.enableVertexAttribArray(index);
          webGL.vertexAttribPointer(
            index,
            attrData.size,
            type,
            normalized,
            stride,
            offset
          );
        }
      }

      return attribute;
    },
    enumerable: true
  },

  /**
   * Recorre los parámetros ACTIVE_ATTRIBUTES, crea una colección de objetos
   * attribute y la retorna.
   * @param  {WebGLRenderingContext} webGL Context de renderizado WebGL.
   * @param  {WebGLProgram} program Programa WebGL.
   * @return {Object} Objeto attributesCollection.
   */
  getAttributesCollection: {
    value: function (webGL, program) {
      var attributesCollection = Object.create(null, {
        collection: {
          value: Object.create(null),
          enumerable: true
        }
      });
      var num = webGL.getProgramParameter(program, webGL.ACTIVE_ATTRIBUTES);

      for (var i = 0; i < num; i++) {
        var info = webGL.getActiveAttrib(program, i);
        if (!info) {
          break;
        }

        Object.defineProperty(attributesCollection.collection, info.name, {
          value: fre.gl.getAttribute(webGL, program, info),
          writable: true,
          configurable: true,
          enumerable: true
        });
      }

      Object.defineProperty(attributesCollection, 'set', {
        value: function (value) {
          var collection = attributesCollection.collection;

          Object.keys(collection).forEach(function (name) {
            var attrib = collection[name];
            var attribData = value[name];

            // ¿Hay un buffer? Establece los datos al puntero.
            if (attribData.buffer)  {
              attrib.setPointer(attribData);
            } else {
              attrib.set(attribData);
            }
          });
        },
        enumerable: true
      });

      return attributesCollection;
    },
    enumerable: true
  },

  /**
   * Obtiene una variable con calificador uniform y retorn un objeto uniform.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {WebGLProgram} program Programa WebGL.
   * @param  {WebGLActiveInfo} info Información del uniform.
   * @return {Object} Objeto uniform.
   */
  getUniform: {
    value: function (webGL, program, info) {
      var setterName = fre.gl.getSetterNameByType(webGL, 'uniform', info.type);

      if (!setterName) {
        return null;
      }

      var TypedArray = fre.gl.getTypedArrayByType(webGL, info.type);
      var location = webGL.getUniformLocation(program, info.name);

      var uniform = Object.create(fre.gl.uniform);
      uniform.name = info.name;
      uniform.type = info.type;
      uniform.size = info.size;
      uniform.location = location;
      uniform.set =  setter(setterName, location, TypedArray);

      function setter(name, location, TypedArray) {
        if (/^uniformMatrix[2-4][fi]v$/.test(name)) {
          return function (value, transpose) {
            if (TypedArray) {
              value = new TypedArray(value);
            }

            webGL[name](location, transpose, value);
          };
        }

        return function (value) {
          if (TypedArray) {
            value = new TypedArray(value);
          }

          webGL[name](location, value);
        };
      }

      return uniform;
    },
    enumerable: true
  },

  /**
   * Recorre los parámetros ACTIVE_UNIFORMS, crea una colección de objetos
   * uniform y la retorna.
   * @param  {WebGLRenderingContext} webGL Context de renderizado WebGL.
   * @param  {WebGLProgram} program Programa WebGL.
   * @return {Object} Objeto uniformsCollection.
   */
  getUniformsCollection: {
    value: function (webGL, program) {
      var uniformsCollection = Object.create(null, {
        collection: {
          value: Object.create(null),
          enumerable: true
        }
      });
      var num = webGL.getProgramParameter(program, webGL.ACTIVE_UNIFORMS);

      for (var i = 0; i < num; i++) {
        var info = webGL.getActiveUniform(program, i);
        if (!info) {
          break;
        }

        var name = info.name;

        // Quita el sufijo de array
        if (name.substr(-3) === '[0]') {
          name = name.substr(0, name.length - 3);
        }

        Object.defineProperty(uniformsCollection.collection, name, {
          value: fre.gl.getUniform(webGL, program, info),
          writable: true,
          configurable: true,
          enumerable: true
        });
      }

      Object.defineProperty(uniformsCollection, 'set', {
        value: function (value) {
          var collection = uniformsCollection.collection;

          Object.keys(collection).forEach(function (name) {
            var uniform = collection[name];
            uniform.set(value[name]);
          });
        },
        enumerable: true
      });

      return uniformsCollection;
    },
    enumerable: true
  },

  /**
   * Crea un webGLBuffer y retorna un objeto buffer.
   * @param  {WebGLRenderingContext} webGL Contexto de renderizado WebGL.
   * @param  {Number} target Buffer objetivo.
   * @param  {Number | ArrayBuffer} data Array de puntos o tamaño del buffer.
   * @param  {Number} usage Uso del buffer.
   * @return {Object} Objeto buffer.
   */
  getBuffer: {
    value: function (webGL, target, data, usage) {
      var webGLBuffer = webGL.createBuffer();

      // Verifica la creación
      if (!webGLBuffer) {
        fre.error('Incapaz de crear el webGLBuffer.');
        return null;
      }

      webGL.bindBuffer(target, webGLBuffer);
      webGL.bufferData(target, data, usage);

      var buffer = Object.create(fre.gl.buffer);
      buffer.target = target;
      buffer.webGLBuffer = webGLBuffer;

      return buffer;
    },
    enumerable: true
  },

  /**
   * Objeto shader.
   * @type {Object}
   */
  shader: {
    value: require('./shader.js'),
    enumerable: true
  },
  /**
   * Objeto program.
   * @type {Object}
   */
  program: {
    value: require('./program.js'),
    enumerable: true
  },
  /**
   * Objeto attribute.
   * @type {Object}
   */
  attribute: {
    value: require('./attribute.js'),
    enumerable: true
  },
  /**
   * Objeto uniform.
   * @type {Object}
   */
  uniform: {
    value: require('./uniform.js'),
    enumerable: true
  },
  /**
   * Objeto buffer.
   * @type {Object}
   */
  buffer: {
    value: require('./buffer.js'),
    enumerable: true
  }
});

Object.preventExtensions(gl);

module.exports = gl;
