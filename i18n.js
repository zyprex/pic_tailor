/* Description: simple script for static site i18n
 * Usage:
 *  Include this script to any html pages
 * --- HTML element ---
 *  <select id="langCtrl">
 *    <option value='en-US'>en</option>
 *    <option value='zh-CN'>中文</option>
 *  </select>
 *
 * --- HTML tag ---
 *  <p lang="langKey">...</p>
 *
 * --- JSON ---
 *  i18n/en-US.json
 *  {
 *    "langKey": "Language for en-US"
 *  }
 *  i18n/zh-CN.json
 *  {
 *    "langKey": "Language for zh-CN"
 *  }
 *
 * */
let prefLangList = ['en-US', 'zh-CN'];
let defaultLang = 'en-US';
let prefLang = sessionStorage.getItem('prefLang');
if (prefLang == null) {
  prefLang = prefLangList.includes(navigator.language) ? navigator.language : defaultLang;
}
if (langCtrl) {
  langCtrl.addEventListener('change', function(e) {
    sessionStorage.setItem('prefLang', this.value);
    i18n(this.value);
  });
  langCtrl.value = prefLang;
}
function i18n(lang) {
  fetch(`i18n/${lang}.json`)
  .then(response => response.json())
  .then(data => {
    for (const key in data) {
      document.querySelectorAll(`[lang=${key}]`).forEach(el => {
        el.innerHTML = data[key];
      });
    }
  });
}
if (prefLang != defaultLang) i18n(prefLang);
