const canvas = document.getElementById('canvasOrigin');
const ctx = canvas.getContext("2d");

presetSizeChange();

paramASize.addEventListener('change', presetSizeChange);
paramPPI.addEventListener('change', presetSizeChange);
paramW.addEventListener('blur', function(e) { paramWmm.value = px2mm(this.value); });
paramH.addEventListener('blur', function(e) { paramHmm.value = px2mm(this.value); });
paramWmm.addEventListener('blur', function(e) { paramW.value = mm2px(this.value); });
paramHmm.addEventListener('blur', function(e) { paramH.value = mm2px(this.value); });

function presetSizeChange() {
  let hMM = paramASize.value;
  let wMM = Math.round(paramASize.value / Math.sqrt(2));
  paramHmm.value = hMM;
  paramWmm.value = wMM;
  paramH.value = mm2px(hMM);
  paramW.value = mm2px(wMM);
}

function mm2px(mm) {
  let ppi = paramPPI.value;
  let inch = mm/25.4;
  return Math.ceil(inch*ppi);
}

function px2mm(px) {
  let ppi = paramPPI.value;
  return Math.floor(px/ppi*25.4);
}

function getPaperImage() {
  canvas.width = paramW.value;
  canvas.height = paramH.value;
  ctx.fillStyle = paramColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

btnOk.addEventListener("click", getPaperImage);
btnDownload.addEventListener('click', function(e) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL(`image/${paramMime.value}`);
  a.download = `paper.${paramMime.value}`;
  a.click();
  a.remove();
});

