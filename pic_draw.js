const canvas = document.getElementById('canvasOrigin');
const ctx = canvas.getContext("2d");

let objUrl = null;
let oImgDataList = [];
let oImgDataPreStraight = null;
let mDown = false;
let mX, mY; // mouse coordinate
let tX, tY; // touch coordinate
let oX = -1, oY = -1; // older coordinate (previous point)
let sX, sY; // start coordinate

let penColor = paramPenColor.value;
let penSize = parseFloat(paramPenSize.value);
let lineCap = paramLineCap.value;
let lineJoin = paramLineJoin.value;

let nRatio = null;

paramPenColor.addEventListener('change', function(e) { penColor = this.value; });
paramPenSize.addEventListener('change', function(e) { penSize = parseFloat(this.value); });
paramLineCap.addEventListener('change', function(e) { lineCap = this.value; });
paramLineJoin.addEventListener('change', function(e) { lineJoin = this.value; });

function addImage(src) {
  const image = new Image();
  image.onload = drawImage;
  image.src = src;
}

function drawImage() {
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;
  ctx.drawImage(this, 0, 0);
  nRatio = offsetRatio();
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
    nRatio = offsetRatio();
  }
});

btnUndo.addEventListener('click', function(e) {
  loadOldImagData();
});

btnReset.addEventListener('click', function(e) {
  redraw();
});

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `drew.${paramMime.value}`;
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

function drawStraight(x, y) {
  if (paramPenShape.value != "straight") return;
  applyImageDataPreStraight()
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(sX, sY);
  ctx.stroke();
  ctx.closePath();
}

function selectPen() {
  ctx.fillStyle = penColor;
  ctx.strokeStyle = penColor;
  ctx.lineWidth = penSize;
  ctx.lineCap = lineCap;
  ctx.lineJoin = lineJoin;
}

function drawOn(x, y) {
  switch (paramPenShape.value) {
    case "square":
      ctx.rect(x - penSize/2, y - penSize/2, penSize, penSize);
      ctx.fill();
      break;
    case "dot":
      ctx.beginPath();
      ctx.arc(x, y, penSize, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
      break;
    case "line":
      if (oX == -1) {
        oX = x;
        oY = y;
      }
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(oX, oY);
      ctx.stroke();
      ctx.closePath();
      oX = x;
      oY = y;
      break;
  }
}

function offsetRatio() {
  // normalize coordinate
  let dispWidth = parseInt(window.getComputedStyle(canvas).width);
  let dispHeight = parseInt(window.getComputedStyle(canvas).height);
  return {
    w: (canvas.width / dispWidth),
    h: (canvas.height / dispHeight),
  };
}

window.addEventListener('resize', function(e) {
  nRatio = offsetRatio();
});

function whenMouseDown(e) {
  saveOldImageData();
  storeImageDataPreStraight()
  mDown = true;
  mX = nRatio.w * e.offsetX;
  mY = nRatio.h * e.offsetY;
  sX = mX;
  sY = mY;
  selectPen();
  drawOn(mX, mY);
}

function whenMouseMove(e) {
  // e.layerX, e.layerY
  mX = nRatio.w * e.offsetX;
  mY = nRatio.h * e.offsetY;
  if (mDown) {
    // console.log(e.offsetX, e.offsetY, mX,mY);
    drawOn(mX, mY);
    drawStraight(mX, mY);
  }
}


function whenMouseUp(e) {
  mDown = false;
  // reset oX oY
  oX=-1;
  oY=-1;
  mX = nRatio.w * e.offsetX;
  mY = nRatio.h * e.offsetY;
  releaseImageDataPreStraight()
}

canvas.addEventListener('mousedown', whenMouseDown);
canvas.addEventListener('mousemove', whenMouseMove);
window.addEventListener('mouseup', whenMouseUp);

function whenTouchStart(e) {
  if (e.touches.length == 1) {
    saveOldImageData();
    storeImageDataPreStraight()
    let tp = e.touches[0];
    tX = tp.pageX - tp.target.offsetLeft;
    tY = tp.pageY - tp.target.offsetTop;
    tX *= nRatio.w;
    tY *= nRatio.h;
    sX = tX;
    sY = tY;
    selectPen();
    drawOn(tX,tY);
    e.preventDefault();
  }
}

function whenTouchMove(e) {
  if (e.touches.length == 1) {
    let tp = e.touches[0];
    tX = tp.pageX - tp.target.offsetLeft;
    tY = tp.pageY - tp.target.offsetTop;
    tX *= nRatio.w;
    tY *= nRatio.h;
    drawOn(tX,tY);
    drawStraight(tX, tY);
    e.preventDefault();
  }
}

function whenTouchEnd(e) {
  if (e.changedTouches.length == 1) {
    let tp = e.changedTouches[0];
    tX = tp.pageX - tp.target.offsetLeft;
    tY = tp.pageY - tp.target.offsetTop;
    tX *= nRatio.w;
    tY *= nRatio.h;
    releaseImageDataPreStraight()
  }
  oX = -1;
  oY = -1;
}
canvas.addEventListener('touchstart', whenTouchStart);
canvas.addEventListener('touchmove', whenTouchMove);
canvas.addEventListener('touchend', whenTouchEnd);

function saveOldImageData() {
  oImgDataList.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function loadOldImagData() {
  if (oImgDataList.length > 0) {
    ctx.putImageData(oImgDataList.pop(), 0, 0);
  }
}

function storeImageDataPreStraight() {
  oImgDataPreStraight = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function applyImageDataPreStraight() {
  if (oImgDataPreStraight != null) {
    ctx.putImageData(oImgDataPreStraight, 0, 0);
  }
}

function releaseImageDataPreStraight() {
  oImgDataPreStraight = null;
}

