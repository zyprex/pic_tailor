const ctx = canvas.getContext("2d");

let objUrl = null;
fieldCrop.style.display = 'none';
modeTrim.addEventListener('change', function(e) {
  if(this.checked) {
    fieldTrim.style.display = 'block';
    fieldCrop.style.display = 'none';
  }
});
modeCrop.addEventListener('change', function(e) {
  if(this.checked) {
    fieldTrim.style.display = 'none';
    fieldCrop.style.display = 'block';
  }
});

function addImage(src) {
  const image = new Image();
  image.onload = drawImage;
  image.src = src;
}

function drawImage() {
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;
  paramDW.value = this.naturalWidth;
  paramDH.value = this.naturalHeight;
  ctx.drawImage(this, 0, 0);
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

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `cut.${paramMime.value}`;
  a.click();
  a.remove();
});

function drawImageCropped() {
  let sx, sy, dw, dh;
  sx = parseInt(paramSX.value);
  sy = parseInt(paramSY.value);
  dw = parseInt(paramDW.value);
  dh = parseInt(paramDH.value);
  canvas.width = dw;
  canvas.height = dh;
  ctx.drawImage(this, sx, sy, dw, dh, 0, 0, dw, dh);
  showInfo(`${this.naturalWidth}x${this.naturalHeight} to ${canvas.width}x${canvas.height}`);
}

function drawImageTrimmed() {
  let t, b, l, r, w = this.naturalWidth, h = this.naturalHeight;
  t = parseInt(paramT.value);
  b = parseInt(paramB.value);
  l = parseInt(paramL.value);
  r = parseInt(paramR.value);
  let sx = l, sy = t, dw = w - (l+r), dh = h - (t+b);
  canvas.width = dw;
  canvas.height = dh;
  ctx.drawImage(this, sx, sy, dw, dh, 0, 0, dw, dh);
  showInfo(`${w}x${h} to ${canvas.width}x${canvas.height}`);
}

btnCut.addEventListener('click', function(e) {
  clearCanvas();
  const image = new Image();
  image.onload = modeTrim.checked ? drawImageTrimmed : drawImageCropped;
  image.src = objUrl;
});

btnReset.addEventListener('click', function(e) {
  clearCanvas();
  addImage(objUrl);
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

function showInfo(text) {
  txtInfo.innerHTML = text;
}

