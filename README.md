# Intro

Pic Tailor is a bunch of tools for quick edit images
in a NO-NONSENSE way!

Supported image formats: png, jpg, webp.

Important to know:

- Based on JS canvas API.
- Storage used about 150kB.
- Designed for 100% offline use. (thanks to PWA's service worker)
- Some parameters only apply after you keyboard focus lost.
- Mobile browser should work the same as desktop browser, but may inconvenient.
  Use chrome or firefox if you can.
- Large image edit depends on your browser's performance.
- PNGs are lossless compression format, image quality can't apply to it, if you want resize it,
  adjust their dimensions.

Explain of abbratives and other confusing words:

- Roll: This mode put the 1st image on top, the 2nd image under 1st image,
  the 3rd image under 2nd image ...
- Pile: This mode put the 1st image on bottom, the 2nd image above 1st image,
  the 3rd image above 2nd image ...
- TTB: Top to bottom concat mode, align left
- LTR: Left to right concat mode, align top
- X: x-axis, x-axis offset (px)
- Y: y-axis, y-axis offset (px)
- T: Distance from top (px)
- B: Distance from bottom (px)
- L: Distance from left (px)
- R: Distance from right (px)
- W: width (px)
- H: height (px)
- Color: CSS color format

# Reason

I'm used to editing image from time to time, not very often.
PS, GIMP, always trigger my crypophobia, they're powerful
but not novice friendly. To become an expert of those things,
are not my purpose. I'm struggle in learn, forgot, and
learn again.

Search on Internet for long times,  I could hardly found online tool that:

1. Respect user's privacy.
2. Short loading time
3. Low memory cost.
4. Simple and intuitive interface.
5. Ad-free.

So, I do it myself.

This is my personal beliefs: to make life easier,
simple task should be keep simple enough.

# Credits

Some online image editors that worth to try:

- [minPaint](http://viliusle.github.io/miniPaint/)
- [photojshop](https://aurbano.github.io/photojshop/)
- [imagefilters](http://www.arahaya.com/imagefilters/)

