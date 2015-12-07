function main() {
  var shaderSources = [];

  fre.loader.ajax('shaders/transform.vert', onLoadVert, null, onError);
  fre.loader.ajax('shaders/transform.frag', onLoadFrag, null, onError);

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
  var canvas = document.getElementById('example-transform'),
      gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    console.log('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  var program = new fre.gl.Program(gl, shaderSources);

  var TypedArray = fre.gl.Variable.getTypedArrayByType(gl, program.attributes.a_Position.type);
  var vertexArray = new TypedArray([
    -0.1, -0.1, 0.0,
    0.1, -0.1, 0.0,
    0.0, 0.1, 0.0
  ]);
  var buffer = new fre.gl.Buffer(gl, gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  var data = {
    a_Position: {
      buffer: buffer,
      size: 3
    },
    u_ModelMatrix: fre.math.mat4.create(),
    u_FragColor: [1.0, 1.0, 0.0, 1.0]
  };

  program.attributes.setCollection(data);

  gl.useProgram(program.webGLProgram);

  program.uniforms.setCollection(data);

  function draw(gl, n) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  var STEP = 100;
  var currentAngle = 0;

  function animate(u_ModelMatrix, modelMatrix, delta) {
    var deltaStep = (delta * STEP) / 1000.0;

    currentAngle += (deltaStep % 360) * (Math.PI / 180);

    var translation = [0.5 * Math.sin(currentAngle), -0.5 * Math.cos(currentAngle), 0];
    var scaleXY = 0.5 * Math.sin(currentAngle * 4) + 1;
    var scale = [scaleXY, scaleXY, 0];

    fre.math.mat4.identity(modelMatrix);
    fre.math.mat4.translate(modelMatrix, modelMatrix, translation);
    fre.math.mat4.rotate(modelMatrix, modelMatrix, currentAngle, [0, 0, 1]);
    fre.math.mat4.scale(modelMatrix, modelMatrix, scale);

    u_ModelMatrix.set(modelMatrix);
  }

  var n = vertexArray.length / data.a_Position.size;
  var lastTime;

  function tick(timestamp) {
    if (!lastTime) {
      startTime = lastTime = timestamp;
    }

    var delta = timestamp - lastTime;
    lastTime = timestamp;

    animate(program.uniforms.u_ModelMatrix, data.u_ModelMatrix, delta);
    draw(gl, n);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
