function main() {
  var shaderSources = [];

  fre.loader.ajax('shaders/point.vert', onLoadVert, null, onError);
  fre.loader.ajax('shaders/point.frag', onLoadFrag, null, onError);

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
  var canvas = document.getElementById('example-point'),
      gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    console.log('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  var program = new fre.gl.Program(shaderSources);

  var data = {
    a_Position: [0.0, 0.0, 0.0, 1.0],
    u_PointSize: [10.0],
    u_FragColor: [1.0, 1.0, 0.0, 1.0]
  };

  program.attributes.setCollection(data);

  gl.useProgram(program.webGLProgram);

  program.uniforms.setCollection(data);

  draw();

  function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
