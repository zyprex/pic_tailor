const ctx = canvas.getContext("2d");

let objUrl = null;

function addImage(src) {
  const image = new Image();
  image.onload = drawImageResized;
  image.src = src;
}

function drawImageResized() {
  let times = parseFloat(paramDimension.value);
  canvas.width = this.naturalWidth * times;
  canvas.height = this.naturalHeight * times;
  ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
  showInfo(`${this.naturalWidth}x${this.naturalHeight} to ${canvas.width}x${canvas.height}`);
}

inputImg.addEventListener('change', function(e) {
  if (this.files.length == 0) {
    reset();
    return;
  }
  clearObjUrl();
  objUrl = URL.createObjectURL(this.files[0]);
  addImage(objUrl);
});

paramDimension.addEventListener('blur', function(e) {
  adjust();
  addImage(objUrl);
});

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, parseFloat(paramQuality.value));
  a.download = `resized.${paramMime.value}`;
  a.click();
  a.remove();
});

function adjust() {
  clearCanvas();
}

function reset() {
  clearObjUrl();
  clearCanvas();
}

function clearObjUrl() {
  if (objUrl) {
    window.URL.revokeObjectURL(objUrl);
    objUrl = null;
  }
}

function clearCanvas() {
  canvas.width = 0;
  canvas.height = 0;
}

function showInfo(text) {
  txtInfo.innerHTML = text;
}
