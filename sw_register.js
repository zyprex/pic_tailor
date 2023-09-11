window.addEventListener('load', () =>{ registerSW() });

// Register the Service Worker
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator
        .serviceWorker
        .register('sw.js');
    }
    catch (e) {
      console.log('Service Worker `sw.js` registration failed');
    }
  }
}
