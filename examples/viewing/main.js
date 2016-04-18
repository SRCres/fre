function main() {
  var shaderFiles = ['shaders/viewing.vert', 'shaders/viewing.frag'];
  loadShaders(shaderFiles, initialize);
}

function initialize(shaderSources) {
  var canvas = document.getElementById('example-viewing'),
      gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    console.log('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  var program = new fre.gl.getProgram(gl, shaderSources);

  var TypedArray = fre.gl.getTypedArrayByType(gl, program.attributes.collection.a_Position.type);
  var vertexColorArray = new TypedArray([
     0.0,  0.5, -0.4, 0.0, 1.0, 1.0, // Cian fondo
    -0.5, -0.5, -0.4, 0.0, 1.0, 1.0,
     0.5, -0.5, -0.4, 0.0, 1.0, 1.0,

     0.5,  0.5, -0.2, 1.0, 1.0, 0.0, // Amarillo medio
    -0.5,  0.5, -0.2, 1.0, 1.0, 0.0,
     0.0, -0.5, -0.2, 1.0, 1.0, 0.0,

     0.0,  0.5,  0.0, 1.0, 0.0, 1.0, // Magenta frente
    -0.5, -0.5,  0.0, 1.0, 0.0, 1.0,
     0.5, -0.5,  0.0, 1.0, 0.0, 1.0
  ]);
  var buffer = new fre.gl.getBuffer(gl, gl.ARRAY_BUFFER, vertexColorArray, gl.STATIC_DRAW);

  var FSIZE = vertexColorArray.BYTES_PER_ELEMENT;

  var data = {
    a_Position: {
      buffer: buffer,
      size: 3,
      stride: FSIZE * 6
    },
    a_Color: {
      buffer: buffer,
      size: 3,
      stride: FSIZE * 6,
      offset: FSIZE * 3
    },
    u_ModelMatrix: fre.math.mat4.create(),
    u_ViewMatrix: fre.math.mat4.create()
  };

  program.attributes.set(data);

  gl.useProgram(program.webGLProgram);

  var eye = [0.20, 0.25, 0.25];
  var at = [0.0, 0.0, 0.0];
  var up = [0.0, 1.0, 0.0];
  fre.math.mat4.lookAt(data.u_ViewMatrix, eye, at, up);

  program.uniforms.set(data);

  var n = vertexColorArray.length / 6;
  function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  draw();
}
