export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // In development, we want to register the service worker every time
        if (process.env.NODE_ENV === 'development') {
          const registrations = await navigator.serviceWorker.getRegistrations();

          for (const registration of registrations) {
            await registration.unregister();
          }
          console.log('Development mode: Unregistered existing service workers');
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful:', registration.scope);
      } catch (err) {
        console.error('ServiceWorker registration failed:', err);
      }
    });
  } else {
    console.log('Service workers are not supported');
  }
}
