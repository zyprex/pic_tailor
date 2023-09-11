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
  ctx.filter = paramFilter.value;
  ctx.drawImage(this, 0, 0);
  applyEffect();
}

function applyEffect() {
  if (paramEffect.value == 'origin') {
    return;
  }
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  switch(paramEffect.value) {
    case "b&w": effectBlackAndWhite(imgData, data); break;
    case "rgbMask": effectRGBMask(imgData, data); break;
    case "emboss": effectEmboss(imgData, data); break;
    case "snowNoise": effectSnowNoise(imgData, data); break;
    case "mirror": effectMirror(imgData, data); break;
    case "mosaic": effectMosaic(imgData, data); break;
    case "sharpen": effectSharpen(imgData); break;
  }
}

function effectBlackAndWhite(imgData, data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const avg = (r+g+b)/3;
    data[i] = data[i + 1] = data [i + 2] = avg >= 128 ? 255 : 0;
  }
  ctx.putImageData(imgData, 0, 0);
}

function effectRGBMask(imgData, data) {
  let rgbMaskColor = parseInt(paramEffectArg.value);
  for (let i = 0; i < data.length; i+=4) {
    let r = data[i+0], g = data[i+1], b = data[i+2];
    let avg = (r+g+b)/3;
    data[i+0] = 0, data[i+1] = 0, data[i+2] = 0;
    switch (rgbMaskColor) {
      case 0: data[i+0] = avg; break;
      case 1: data[i+1] = avg; break;
      case 2: data[i+2] = avg; break;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function effectEmboss(imgData, data) {
  let w = canvas.width, h = canvas.height, dim = parseInt(paramEffectArg.value);
  for (let i = h; i > 0; i--) {
   for (let j = w; j > 0; j--) {
     for (let k = 0; k < 3; k++) {
       let num = (i * w + j) * 4 + k;
       let numUp = ((i - 1) * w + j) * 4 + k;
       // let numDown = ((i + 1) * w + j) * 4 + k;
       if (dim >= 0) {
         data[num] = data[num] - data[numUp - 4] + dim;
       } else {
         data[num] = 255 - (data[num] - data[numUp - 4] + Math.abs(dim));
       }
     }
   }
  }
  ctx.putImageData(imgData, 0, 0);
}

function effectSnowNoise(imgData, data) {
  let w = canvas.width, h = canvas.height, noisy=parseFloat(paramEffectArg.value);
  for (let i = h; i > 0; i--) {
     for (let j = w; j > 0; j--) {
       let num = (i * w + j) * 4;
       if (Math.random() < noisy) {
         data[num] = 255;
         data[num+1] = 255;
         data[num+2] = 255;
       }
     }
  }
  ctx.putImageData(imgData, 0, 0);
}

function effectMirror(imgData, data) {
  let w = canvas.width, h = canvas.height, direction=parseInt(paramEffectArg.value);
  let wp = w*4; // width points length
  let tp = data.length; // total points length
  if (direction > 0) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < wp/2; x+=4) {
        // p, q is mirror pixel start point, LR
        let p = x+y*wp, q = (wp-x)+y*wp-4;
        let r = data[p+0], g = data[p+1], b = data[p+2], a = data[p+3];
        data[p+0] = data[q+0]; data[q+0] = r;
        data[p+1] = data[q+1]; data[q+1] = g;
        data[p+2] = data[q+2]; data[q+2] = b;
        data[p+3] = data[q+3]; data[q+3] = a;
      }
    }
  }
  if (direction < 0) {
    for (let x = 0; x < wp; x+=4) {
      for (let y = 0; y < h/2; y++) {
        // p, q is mirror pixel start point, TB
        let p = x+y*wp, q = tp-((wp-x)+y*wp);
        let r = data[p+0], g = data[p+1], b = data[p+2], a = data[p+3];
        data[p+0] = data[q+0]; data[q+0] = r;
        data[p+1] = data[q+1]; data[q+1] = g;
        data[p+2] = data[q+2]; data[q+2] = b;
        data[p+3] = data[q+3]; data[q+3] = a;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// author -- https://github.com/arahaya/ImageFilters.js
function effectMosaic(imgData, data) {
  let blockSize = parseInt(paramEffectArg.value);
  let srcWidth = imgData.width,
    srcHeight = imgData.height,
    srcLength = data.length;
    // dstImageData = this.utils.createImageData(srcWidth, srcHeight),
    // dstPixels = dstImageData.data;
  let cols = Math.ceil(srcWidth / blockSize),
    rows = Math.ceil(srcHeight / blockSize),
    row, col,
    x_start, x_end, y_start, y_end,
    x, y, yIndex, index, size,
    r, g, b, a;
  for (row = 0; row < rows; row += 1) {
    y_start = row * blockSize;
    y_end = y_start + blockSize;
    if (y_end > srcHeight) {
      y_end = srcHeight;
    }
    for (col = 0; col < cols; col += 1) {
      x_start = col * blockSize;
      x_end = x_start + blockSize;
      if (x_end > srcWidth) {
        x_end = srcWidth;
      }
      // get the average color from the src
      r = g = b = a = 0;
      size = (x_end - x_start) * (y_end - y_start);
      for (y = y_start; y < y_end; y += 1) {
        yIndex = y * srcWidth;
        for (x = x_start; x < x_end; x += 1) {
          index = (yIndex + x) << 2;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          a += data[index + 3];
        }
      }
      r = (r / size) + 0.5 | 0;
      g = (g / size) + 0.5 | 0;
      b = (b / size) + 0.5 | 0;
      a = (a / size) + 0.5 | 0;
      // fill the dst with that color
      for (y = y_start; y < y_end; y += 1) {
        yIndex = y * srcWidth;
        for (x = x_start; x < x_end; x += 1) {
          index = (yIndex + x) << 2;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = a;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

const convolutionFilter = function (srcImageData, matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
  let srcPixels = srcImageData.data,
    srcWidth = srcImageData.width,
    srcHeight = srcImageData.height,
    srcLength = srcPixels.length,
    dstImageData = ctx.createImageData(srcWidth, srcHeight),
    dstPixels = dstImageData.data;
  divisor = divisor || 1;
  bias = bias || 0;
  // default true
  (preserveAlpha !== false) && (preserveAlpha = true);
  (clamp !== false) && (clamp = true);
  color = color || 0;
  alpha = alpha || 0;
  let index = 0,
    rows = matrixX >> 1,
    cols = matrixY >> 1,
    clampR = color >> 16 & 0xFF,
    clampG = color >> 8 & 0xFF,
    clampB = color & 0xFF,
    clampA = alpha * 0xFF;
  for (let y = 0; y < srcHeight; y += 1) {
    for (let x = 0; x < srcWidth; x += 1, index += 4) {
      let r = 0, g = 0, b = 0, a = 0, replace = false, mIndex = 0, v;
      for (let row = -rows; row <= rows; row += 1) {
        let rowIndex = y + row,
          offset;
        if (0 <= rowIndex && rowIndex < srcHeight) {
          offset = rowIndex * srcWidth;
        } else if (clamp) {
          offset = y * srcWidth;
        } else {
          replace = true;
        }
        for (let col = -cols; col <= cols; col += 1) {
          let m = matrix[mIndex++];
          if (m !== 0) {
            let colIndex = x + col;
            if (!(0 <= colIndex && colIndex < srcWidth)) {
              if (clamp) {
                colIndex = x;
              } else {
                replace = true;
              }
            }
            if (replace) {
              r += m * clampR;
              g += m * clampG;
              b += m * clampB;
              a += m * clampA;
            } else {
              let p = (offset + colIndex) << 2;
              r += m * srcPixels[p];
              g += m * srcPixels[p + 1];
              b += m * srcPixels[p + 2];
              a += m * srcPixels[p + 3];
            }
          }
        }
      }
      dstPixels[index] = (v = r / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
      dstPixels[index + 1] = (v = g / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
      dstPixels[index + 2] = (v = b / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
      dstPixels[index + 3] = preserveAlpha ? srcPixels[index + 3] : (v = a / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
    }
  }
  return dstImageData;
};

function effectSharpen(imgData) {
  let factor = parseFloat(paramEffectArg.value);
  //Convolution formula from VIGRA
  let newImgData = convolutionFilter(imgData, 3, 3, [
    -factor / 16, -factor / 8, -factor / 16,
    -factor / 8, factor * 0.75 + 1, -factor / 8,
    -factor / 16, -factor / 8, -factor / 16
  ]);
  ctx.putImageData(newImgData, 0, 0);
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

let effectArgUnitTable = {
  rgbMask:{val:'0',unit:'(0=red,1=green,2=blue)'},
  emboss:{val:'128',unit:'(-255~255),>0 emboss,<0 deboss'},
  snowNoise:{val:'0.1',unit:'(0~1)'},
  mirror:{val:'1',unit:'(1:LR,-1:TB)'},
  mosaic:{val:'6',unit:'px'},
  sharpen:{val:'3',unit:''},
};
paramEffectArg.style.display = 'none';
paramEffectArgUnit.style.display = 'none';
paramEffect.addEventListener('change', function(e) {
  let preset = effectArgUnitTable[this.value];
  if (preset !== undefined) {
    paramEffectArg.style.display = 'inline';
    paramEffectArgUnit.style.display = 'inline';
    paramEffectArg.value = preset.val;
    paramEffectArgUnit.innerHTML = preset.unit;
  } else {
    paramEffectArg.style.display = 'none';
    paramEffectArgUnit.style.display = 'none';
  }
});

btnUseDefault.addEventListener('click', function(e) {
  paramFilter.value = `blur(0px)
brightness(100%)
contrast(100%)
grayscale(0%)
hue-rotate(0deg)
invert(0%)
opacity(100%)
saturate(100%)
sepia(0%)
`;
});

btnApply.addEventListener('click', function(e) {
  redraw();
});

btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`, 1);
  a.download = `filtered.${paramMime.value}`;
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
