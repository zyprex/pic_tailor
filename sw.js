let siteCacheName = "pic_tailor";

let assets = [
  '/',
  '/pic_tailor.html', '/pic_tailor.js',
  '/pic_resize.html', '/pic_resize.js',
  '/pic_cut.html', '/pic_cut.js',
  '/pic_rotate.html', '/pic_rotate.js',
  '/pic_color.html', '/pic_color.js',
  '/pic_filter.html', '/pic_filter.js',
  '/pic_draw.html', '/pic_draw.js',
  '/pic_text.html', '/pic_text.js',
  '/pic_paper.html', '/pic_paper.js',
  '/style.css',
  '/i18n.js',
  '/i18n/',
  '/i18n/en-US.json',
  '/i18n/zh-CN.json',
  '/ext/color_ref.html', '/ext/color_ref.js',
  '/ext/colordb_material.json', '/ext/colordb_named.json',
  '/ext/rate_calc.html', '/ext/rate_calc.js',
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(siteCacheName).then(function (cache) {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
