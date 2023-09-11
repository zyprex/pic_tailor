// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
const ctx = canvas.getContext("2d");

let objUrl = null;

function addImage(src) {
  const image = new Image();
  image.onload = drawImage;
  image.src = src;
}

function drawImage() {
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;
  ctx.drawImage(this, 0, 0);
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

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `base.${paramMime.value}`;
  a.click();
  a.remove();
});

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
