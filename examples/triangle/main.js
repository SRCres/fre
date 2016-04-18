function main() {
  var shaderFiles = ['shaders/triangle.vert', 'shaders/triangle.frag'];
  loadShaders(shaderFiles, initialize);
}

function initialize(shaderSources) {
  var canvas = document.getElementById('example-triangle'),
      gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    console.log('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  var program = new fre.gl.getProgram(gl, shaderSources);

  var TypedArray = fre.gl.getTypedArrayByType(gl, program.attributes.collection.a_Position.type);
  var vertexArray = new TypedArray([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
  ]);
  var buffer = new fre.gl.getBuffer(gl, gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  var data = {
    a_Position: {
      buffer: buffer,
      size: 3
    },
    u_FragColor: [1.0, 1.0, 0.0, 1.0]
  };

  program.attributes.set(data);

  gl.useProgram(program.webGLProgram);

  program.uniforms.set(data);

  draw();

  function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, vertexArray.length / data.a_Position.size);
  }
}
