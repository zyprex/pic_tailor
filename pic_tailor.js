const ctx = canvas.getContext("2d");

let gCount = 0;
let gTotal = 0;
let imgs = [];
let objUrls = [];
let mode = "modeRoll";
let firstLoad = true;

function modeChange(ev) {
  let el = ev.target;
  if (el.checked) mode = el.id;
  paramChange();
}

modeRoll.addEventListener('change', modeChange);
modePile.addEventListener('change', modeChange);
modeTTB.addEventListener('change', modeChange);
modeLTR.addEventListener('change', modeChange);

function addImage(src) {
  const image = new Image();
  image.onload = drawImageAll;
  image.src = src;
  imgs.push(image);
}

function drawImagePile(offsetX, offsetY) {
  let imgsCnt = imgs.length;
  canvas.width = imgs[0].naturalWidth + (imgsCnt - 1) * offsetX;
  canvas.height = imgs[0].naturalHeight + (imgsCnt - 1) * offsetY;
  for (let i = 0; i < imgs.length; i++) {
    ctx.drawImage(imgs[i], offsetX * i, offsetY * i);
  }
}

function drawImageRoll(offsetX, offsetY) {
  let imgsCnt = imgs.length;
  canvas.width = imgs[0].naturalWidth + (imgsCnt - 1) * offsetX;
  canvas.height = imgs[0].naturalHeight + (imgsCnt - 1) * offsetY;
  let coords = [[0,0]];
  for (let i = 1; i < imgs.length; i++) {
    let i0w = imgs[i-1].naturalWidth, i0h = imgs[i-1].naturalHeight,
      i1w = imgs[i].naturalWidth, i1h = imgs[i].naturalHeight;
    coords.push(
      [i0w + offsetX - i1w + coords[i-1][0],
        i0h + offsetY - i1h + coords[i-1][1]]
    );
  }
  // console.log(coords);
  for (let i = imgs.length - 1; i >= 0; i--) {
    let dx = coords[i][0], dy = coords[i][1];
    ctx.drawImage(imgs[i], dx, dy);
  }
}

const getMax = (a,b) => Math.max(a,b);
const getSum = (acc,val) => acc+val;
const maxImgWidth = (imgs) => imgs.map(x=>x.naturalWidth).reduce(getMax);
const maxImgHeight = (imgs) => imgs.map(x=>x.naturalHeight).reduce(getMax);
const totalImgWidth = (imgs) => imgs.map(x=>x.naturalWidth).reduce(getSum);
const totalImgHeight = (imgs) => imgs.map(x=>x.naturalHeight).reduce(getSum);

function drawImageTTB() {
  canvas.width = maxImgWidth(imgs);
  canvas.height = totalImgHeight(imgs);
  let dy = 0;
  for (let i = 0; i < imgs.length; i++) {
    ctx.drawImage(imgs[i], 0, dy);
    dy += imgs[i].naturalHeight;
  }
}

function drawImageLTR(image) {
  canvas.width = totalImgWidth(imgs);
  canvas.height = maxImgHeight(imgs);
  let dx = 0;
  for (let i = 0; i < imgs.length; i++) {
    ctx.drawImage(imgs[i], dx, 0);
    dx += imgs[i].naturalWidth;
  }
}

function drawImageAll() {
  gCount++;
  if (gCount == 1 && firstLoad) {
    let gap = Math.floor(this.naturalHeight / 8);
    paramY.value = gap;
  }
  if (gCount == gTotal) {
    let offsetX = parseInt(paramX.value);
    let offsetY = parseInt(paramY.value);
    switch(mode) {
      case 'modeRoll': drawImageRoll(offsetX, offsetY); break;
      case 'modePile': drawImagePile(offsetX, offsetY); break;
      case 'modeTTB': drawImageTTB(); break;
      case 'modeLTR': drawImageLTR(); break;
    }
  }
}

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `all.${paramMime.value}`;
  a.click();
  a.remove();
});

inputImg.addEventListener('change', function(e) {
  if (this.files.length == 0) {
    reset();
    return;
  }
  if (modeAppend.checked) {
    adjust();
    firstLoad = (gTotal == 0);
    gTotal += this.files.length;
  } else {
    reset();
    firstLoad = true;
    gTotal = this.files.length;
  }
  const fileList = this.files;
  for (let file of fileList) {
    const fileURL = URL.createObjectURL(file);
    objUrls.push(fileURL);
  }
  //console.log(objUrls);
  for (let url of objUrls) {
    addImage(url);
  }
});

paramX.addEventListener('blur', paramChange);
paramY.addEventListener('blur', paramChange);

function paramChange() {
  adjust();
  firstLoad = false;
  if (objUrls.length > 0) {
    for (let url of objUrls)  {
      addImage(url);
    }
  }
}

function adjust() {
  clearCanvas();
  imgs = [];
  gCount = 0;
}

function reset() {
  clearObjUrls();
  clearCanvas();
  imgs = [];
  gCount = 0;
  gTotal = 0;
}

function clearObjUrls() {
  if (objUrls.length > 0) {
    for (let url of objUrls)  {
      window.URL.revokeObjectURL(url);
    }
    objUrls = [];
  }
}

function clearCanvas() {
  canvas.width = 0;
  canvas.height = 0;
}
