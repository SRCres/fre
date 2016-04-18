function loadShaders(shaderFiles, cb) {
  var shadersSources = [];

  fre.loader.ajax(shaderFiles[0], onLoadVert, null, onError);
  fre.loader.ajax(shaderFiles[1], onLoadFrag, null, onError);

  function onLoadVert(evt, xhr) {
    shadersSources[0] = xhr.response;
    loaded();
  }

  function onLoadFrag(evt, xhr) {
    shadersSources[1] = xhr.response;
    loaded();
  }

  function onError(evt) {
    console.log(evt);
  }

  function loaded() {
    if (shadersSources.length === 2) {
      cb(shadersSources);
    }
  }
}
