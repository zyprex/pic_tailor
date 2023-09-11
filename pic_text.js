const canvas = document.getElementById('canvasOrigin');
const ctx = canvas.getContext("2d");

let objUrl = null;
let oImgDataList = [];

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

paramDispWidth.addEventListener('change', function(e) {
  if (canvas.width != 0) {
    canvas.style.width = paramDispWidth.value + "%";
  }
});

paramFontFamilyList.addEventListener('change', function(e) {
  paramFontFamily.value = this.value;
});

btnUndo.addEventListener('click', function(e) {
  loadOldImagData();
});

btnAdd.addEventListener('click', function(e) {
  saveOldImageData();
  ctx.font = `${paramFontStyle.value} ${paramFontVar.value} ${paramFontWeight.value} ${paramFontSize.value}px ${paramFontFamily.value}`;
  ctx.textAlign = paramTextAlign.value;
  ctx.textBaseline = paramTextBaseLine.value;
  let lines = paramText.value.split('\n');
  let lineHeight = parseFloat(paramFontSize.value) * parseFloat(paramLineHeight.value);
  if (modeStroke.checked) {
    ctx.strokeStyle = paramFontColor.value;
    ctx.lineWidth = parseFloat(paramStrokeWidth.value);
    for (let i = 0; i < lines.length; i++) {
      ctx.strokeText(lines[i], parseInt(paramX.value), parseInt(paramY.value) + lineHeight * i);
    }
  } else {
    ctx.fillStyle = paramFontColor.value;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], parseInt(paramX.value), parseInt(paramY.value) + lineHeight * i);
    }
  }
});

btnReset.addEventListener('click', function(e) {
  redraw();
});

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `texts.${paramMime.value}`;
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

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  addImage(objUrl);
}

function saveOldImageData() {
  oImgDataList.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function loadOldImagData() {
  if (oImgDataList.length > 0) {
    ctx.putImageData(oImgDataList.pop(), 0, 0);
  }
}

