paramW.addEventListener('change', rateCalc);
paramH.addEventListener('change', rateCalc);
aspectRatioH.addEventListener('change', rateCalc);
aspectRatioW.addEventListener('change', rateCalc);
rateCalc();
function rateCalc() {
  let wRatio = parseFloat(aspectRatioW.value);
  let hRatio = parseFloat(aspectRatioH.value);
  if (wRatio <= 0 || hRatio <=0) return;
  let ratio = wRatio / hRatio;
  let w = parseFloat(paramW.value);
  let h = parseFloat(paramH.value);
  let iw,ih,ow,oh,w0,h0;
  w0 = w;
  h0 = w / ratio;
  console.log(w0,h0);
  if (w0*h0 > w*h) {
    ow = w0, oh = h0;
    iw = h, ih = iw / ratio;
  } else if  (w0*h0 < w*h) {
    iw = w0, ih = h0;
    oh = h, ow = oh * ratio;
  }
  let iPos = iw == w ? `(0,${(1/2*(h-ih))})` : `(${(1/2*(w-iw))},0)`;
  let oPos = ow == w ? `(0,${(1/2*(oh-h))})` : `(${(1/2*(ow-w))},0)`;
  calcResult.innerHTML = `<pre>
Inner Frame:
  ${w}x${h} (0,0)
  ${iw}x${ih} ${iPos}
Outer Frame:
  ${ow}x${oh} (0,0)
  ${w}x${h} ${oPos}
</pre>`;
}
