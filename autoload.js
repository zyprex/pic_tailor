/* Description: auto reload when file length change
 * Usage: 
 *   Include this script to any html pages
 * */
let headersList = new Set();
setInterval(function(){
  let path = window.location.href;
  let xhr = new XMLHttpRequest();
  xhr.open('HEAD', path, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let headers = xhr.getAllResponseHeaders();
      headersList.add(headers);
      if (headersList.size > 1) {
        location.reload();
      }
    }
  };
  xhr.send();
}, 10000);
