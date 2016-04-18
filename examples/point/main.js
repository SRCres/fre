function main() {
  var shaderFiles = ['shaders/point.vert', 'shaders/point.frag'];
  loadShaders(shaderFiles, initialize);
}

function initialize(shaderSources) {
  var canvas = document.getElementById('example-point'),
      gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    fre.error('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  var program = new fre.gl.getProgram(gl, shaderSources);

  var data = {
    a_Position: [0.0, 0.0, 0.0, 1.0],
    u_PointSize: [10.0],
    u_FragColor: [1.0, 1.0, 0.0, 1.0]
  };

  program.attributes.set(data);

  gl.useProgram(program.webGLProgram);

  program.uniforms.set(data);

  draw();

  function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
