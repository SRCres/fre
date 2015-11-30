'use strict';

fre.loader.ajax = function (url, loadCallback, progressCallback, errorCallback) {
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
