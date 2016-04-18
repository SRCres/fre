function main() {
  var shaderFiles = ['shaders/projecting.vert', 'shaders/projecting.frag'];
  loadShaders(shaderFiles, initialize);
}

function initialize(shaderSources) {
  projectionContext('ortho', shaderSources, false);
  projectionContext('perspective', shaderSources, true);
}

function projectionContext(suffix, shaderSources) {
  var canvas = document.getElementById('example-projecting-' + suffix);
  var gl = fre.gl.getWebGLContext(canvas);

  if (!gl) {
    console.log('No se pudo obtener el contexto de renderizado para WebGL.');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var program = fre.gl.getProgram(gl, shaderSources);

  var TypedArray = fre.gl.getTypedArrayByType(gl, program.attributes.collection.a_Position.type);
  var vertexColorArray = new TypedArray([
     0.0,  1.0, -1.0,  0.4,  1.0,  0.4,
    -0.5, -1.0, -1.0,  0.4,  1.0,  0.4,
     0.5, -1.0, -1.0,  1.0,  0.4,  0.4,

     0.0,  1.0,  0.0,  1.0,  1.0,  0.4,
    -0.5, -1.0,  0.0,  1.0,  1.0,  0.4,
     0.5, -1.0,  0.0,  1.0,  0.4,  0.4,

     0.0,  1.0,  1.0,  0.4,  0.4,  1.0,
    -0.5, -1.0,  1.0,  0.4,  0.4,  1.0,
     0.5, -1.0,  1.0,  1.0,  0.4,  0.4
  ]);
  var buffer = fre.gl.getBuffer(gl, gl.ARRAY_BUFFER, vertexColorArray, gl.STATIC_DRAW);

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
    u_MvpMatrix: fre.math.mat4.create()
  };

  program.attributes.set(data);

  gl.useProgram(program.webGLProgram);

  var modelMatrix = fre.math.mat4.create();

  var viewMatrix = fre.math.mat4.create();
  var eye = [0.0, 0.0, 10.0];
  var at = [0.0, 0.0, 0.0];
  var up = [0.0, 1.0, 0.0];
  fre.math.mat4.lookAt(viewMatrix, eye, at, up);

  var projMatrix = fre.math.mat4.create();

  if (suffix == 'ortho') {
    var left = -2.4;
    var right = 2.4;
    var bottom = -2.4;
    var top = 2.4;
    var near = 1.0;
    var far = 100;
    fre.math.mat4.ortho(projMatrix, left, right, bottom, top, near, far);
  } else {
    var fov = Math.PI / 6;
    var aspect = 1.0;
    var near = 1.0;
    var far = 100;
    fre.math.mat4.perspective(projMatrix, fov, aspect, near, far);
  }

  var modelViewMatrix = fre.math.mat4.create();

  program.uniforms.set(data);

  var angle = 0;
  var animationInfoId = suffix == 'ortho' ?  'animation-ortho' : 'animation-perspective';
  var animationInfo = document.getElementById(animationInfoId);
  canvas.tabIndex = 1000;
  canvas.onkeydown = function (evt) {
    if (evt.keyCode == 39) {
      angle += 5;
    }

    if (evt.keyCode == 37) {
      angle -= 5;
    }

    eye[0] = 10 * Math.sin(angle * Math.PI / 180);
    eye[2] = 10 * Math.cos(angle * Math.PI / 180);

    draw();

    animationInfo.innerText = 'eye x: ' + eye[0].toFixed(2) + ' eye z: ' + eye[2].toFixed(2);
  };

  var n = vertexColorArray.length / 6;
  function draw() {
    fre.math.mat4.identity(data.u_MvpMatrix);
    fre.math.mat4.lookAt(viewMatrix, eye, at, up);
    fre.math.mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    fre.math.mat4.multiply(data.u_MvpMatrix, projMatrix, modelViewMatrix);

    program.uniforms.collection.u_MvpMatrix.set(data.u_MvpMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  draw();
}
