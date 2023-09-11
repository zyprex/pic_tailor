const canvas = document.getElementById('canvasOrigin');
const ctx = canvas.getContext("2d");

let objUrl = null;

function rgba2hexa(r, g, b, a) {
  const dec2hex = (dec) => {
    const hx = dec.toString(16);
    return (hx.length == 1 ? "0" + hx : hx).toUpperCase();
  };
  return `hexa(#${dec2hex(r)}${dec2hex(g)}${dec2hex(b)}${dec2hex(a)})`;
}

function rgba2hsla(r, g, b, a) {
  r /= 255;
  g /= 255;
  b /= 255;
  a /= 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const diff = max-min;
  const sum = max+min;
  let h, l, s;
  l = (min+max)/2;
  if (diff == 0) {
    h = 0;
    s = 0;
  } else {
    s = l > 0.5 ? diff/(2.0-sum) : diff/sum;
    switch(max) {
      case r: h = (g-b)/diff + (g < b ? 6 : 0); break;
      case g: h = 2.0 + (b-r)/diff; break;
      case b: h = 4.0 + (r-g)/diff; break;
    }
    h = Math.round(h*60);
  }
  s = Math.round(s*100)
  l =  Math.round(l*100)
  return `hsla(${h},${s}%,${l}%,${a})`;
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
function hideFloatWindow(){floatWindow.style.display='none';}
canvas.addEventListener('contextmenu', function(e) {
  console.log(e);
  e.preventDefault();
  floatWindow.style.display = 'block';
  floatWindow.style.left = e.clientX;
  floatWindow.style.top = e.clientY;
  let n = offsetRatio();
  let pixel = ctx.getImageData(e.offsetX * n.w, e.offsetY * n.h, 1, 1).data;
  let rgba = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]})`;
  let hexa = rgba2hexa(pixel[0], pixel[1], pixel[2], pixel[3]);
  let hsla = rgba2hsla(pixel[0], pixel[1], pixel[2], pixel[3]);
  floatWindow.innerHTML = `<img style="background:${rgba}!important;width:2em;height:2em;cursor:pointer;"
  onclick="hideFloatWindow()"/>
    <p>${rgba}</p><p>${hexa}</p><p>${hsla}</p>`;
  return false;
});

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

