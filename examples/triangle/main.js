function main() {
  var shaderSources = [];

  fre.loader.ajax('shaders/triangle.vert', onLoadVert, null, onError);
  fre.loader.ajax('shaders/triangle.frag', onLoadFrag, null, onError);

  function onLoadVert(evt, xhr) {
    shaderSources[0] = xhr.response;
    loaded();
  }

  function onLoadFrag(evt, xhr) {
    shaderSources[1] = xhr.response;
    loaded();
  }

  function onError(evt) {
    console.log(evt);
  }

  function loaded() {
    if (shaderSources.length === 2) {
      initialize(shaderSources);
    }
  }
}

function initialize(shaderSources) {
  var canvas = document.getElementById('example-triangle'),
      gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    console.log('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  var program = new fre.gl.Program(gl, shaderSources);

  var TypedArray = fre.gl.Variable.getTypedArrayByType(gl, program.attributes.a_Position.type);
  var vertexArray = new TypedArray([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
  ]);
  var buffer = new fre.gl.Buffer(gl, gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  var data = {
    a_Position: {
      buffer: buffer,
      size: 3
    },
    u_FragColor: [1.0, 1.0, 0.0, 1.0]
  };

  program.attributes.setCollection(data);

  gl.useProgram(program.webGLProgram);

  program.uniforms.setCollection(data);

  draw();

  function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, vertexArray.length / data.a_Position.size);
  }
}
