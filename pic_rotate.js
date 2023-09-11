const ctx = canvas.getContext("2d");

let rotateDegree = 0;
let objUrl = null;

function addImage(src) {
  const image = new Image();
  image.onload = drawImageRotated;
  image.src = src;
}

function drawImageRotated() {
  if (rotateDegree % 180 == 0) {
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;
  } else {
    canvas.width = this.naturalHeight;
    canvas.height = this.naturalWidth;
  }
  ctx.save();
  ctx.rotate(rotateDegree * Math.PI / 180);
  switch (rotateDegree) {
    case   0: ctx.drawImage(this, 0, 0); break;
    case  90: ctx.drawImage(this, 0, -canvas.width); break;
    case 180: ctx.drawImage(this, -canvas.width, -canvas.height); break;
    case 270: ctx.drawImage(this, -canvas.height, 0); break;
  }
  ctx.restore();
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

btnRotate.addEventListener('click', function(e) {
  clearCanvas();
  if (!objUrl) return;
  rotateDegree += 90;
  if (rotateDegree == 360) {
    rotateDegree = 0;
  }
  addImage(objUrl);
});

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `rotated.${paramMime.value}`;
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
