import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(<RemixBrowser />, document);

if (`serviceWorker` in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener(`load`, async () => {
    try {
      await navigator.serviceWorker.register(`/entry.worker.js`, {
        type: `module`,
      });

      const registration = await navigator.serviceWorker.ready;

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: `SYNC_REMIX_MANIFEST`,
          manifest: window.__remixManifest,
        });
      } else {
        navigator.serviceWorker.addEventListener(`controllerchange`, () => {
          navigator.serviceWorker.controller?.postMessage({
            type: `SYNC_REMIX_MANIFEST`,
            manifest: window.__remixManifest,
          });
        });
      }

      if (`Notification` in window) {
        const notificationPermission = await Notification.requestPermission();

        if (notificationPermission !== `granted`) {
          return;
        }
      } else {
        return;
      }

      // Get the server's public key
      const vapidPublicKey = await fetch(`/vapidPublicKey`).then((response) => {
        return response.text();
      });

      // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      // Otherwise, subscribe the user
      // (userVisibleOnly allows to specify that we don't plan to
      // send notifications that don't have a visible effect for the user).
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      fetch(`/persistPushSubscription`, {
        headers: {
          [`Content-Type`]: `application/json`,
        },
        body: JSON.stringify(pushSubscription),
        method: `POST`,
      });
    } catch (error: unknown) {
      console.error(`Service worker registration failed`, error);
    }
  });
}

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  const padding = `=`.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, `+`).replace(/_/g, `/`);

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; ++index) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}
