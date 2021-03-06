// node_modules/@remix-run/server-runtime/esm/responses.js
var json = (data, init = {}) => {
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers
  });
};

// app/entry.worker.ts
var STATIC_ASSETS = ["/build/", "/icons/"];
var ASSET_CACHE = "asset-cache";
var DATA_CACHE = "data-cache";
var DOCUMENT_CACHE = "document-cache";
self.addEventListener(`activate`, (event) => {
  event.waitUntil(handleActivateAsync(event).then(() => self.clients.claim()));
});
async function handleActivateAsync(_) {
  debug(`Service worker activated`);
}
self.addEventListener(`fetch`, (event) => {
  event.respondWith((async () => {
    const result = {};
    try {
      result.response = await handleFetchAsync(event);
    } catch (error) {
      result.error = error;
    }
    return appHandleFetch(event, result);
  })());
});
async function handleFetchAsync(event) {
  const url = new URL(event.request.url);
  if (isAssetRequest(event.request)) {
    const cached = await caches.match(event.request, {
      cacheName: ASSET_CACHE,
      ignoreVary: true,
      ignoreSearch: true
    });
    if (cached) {
      debug(`Serving asset from cache`, url.pathname);
      return cached;
    }
    debug(`Serving asset from network`, url.pathname);
    const response = await fetch(event.request);
    if (response.status === 200) {
      const cache = await caches.open(ASSET_CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  }
  if (isLoaderRequest(event.request)) {
    try {
      debug(`Serving data from network`, url.pathname + url.search);
      const response = await fetch(event.request.clone());
      const cache = await caches.open(DATA_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      debug(`Serving data from network failed, falling back to cache`, url.pathname + url.search);
      const response = await caches.match(event.request);
      if (response) {
        response.headers.set(`X-Remix-Worker`, `yes`);
        return response;
      }
      return json({ message: `Network Error` }, {
        status: 500,
        headers: {
          [`X-Remix-Catch`]: `yes`,
          [`X-Remix-Worker`]: `yes`
        }
      });
    }
  }
  if (isDocumentGetRequest(event.request)) {
    try {
      debug(`Serving document from network`, url.pathname);
      let response = await fetch(event.request);
      let cache = await caches.open(DOCUMENT_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      debug(`Serving document from network failed, falling back to cache`, url.pathname);
      let response = await caches.match(event.request);
      if (response) {
        return response;
      }
      throw error;
    }
  }
  return fetch(event.request.clone());
}
function isAssetRequest(request) {
  return isMethod(request, `get`) && STATIC_ASSETS.some((publicPath) => request.url.startsWith(publicPath));
}
function isLoaderRequest(request) {
  let url = new URL(request.url);
  return isMethod(request, `get`) && url.searchParams.get(`_data`);
}
function isDocumentGetRequest(request) {
  return isMethod(request, `get`) && request.mode === `navigate`;
}
function isMethod(request, ...methods) {
  return methods.includes(request.method.toLowerCase());
}
async function appHandleFetch(event, {
  error,
  response
}) {
  debug(event, error);
  return response != null ? response : new Response();
}
self.addEventListener(`install`, (event) => {
  event.waitUntil(handleInstallAsync(event).then(() => self.skipWaiting()));
});
async function handleInstallAsync(_) {
  debug(`Service worker installed`);
}
self.addEventListener(`message`, (event) => {
  event.waitUntil(handleMessageAsync(event));
});
async function handleMessageAsync(event) {
  const cachePromises = /* @__PURE__ */ new Map();
  if (event.data.type === `REMIX_NAVIGATION`) {
    const { isMount, location, matches, manifest } = event.data;
    const documentUrl = location.pathname + location.search + location.hash;
    const [dataCache, documentCache, existingDocument] = await Promise.all([
      caches.open(DATA_CACHE),
      caches.open(DOCUMENT_CACHE),
      caches.match(documentUrl)
    ]);
    if (!existingDocument || !isMount) {
      debug(`Caching document for`, documentUrl);
      cachePromises.set(documentUrl, documentCache.add(documentUrl).catch((error) => {
        debug(`Failed to cache document for ${documentUrl}:`, error);
      }));
    }
    if (isMount) {
      for (const match of matches) {
        if (manifest.routes[match.id].hasLoader) {
          const params = new URLSearchParams(location.search);
          params.set(`_data`, match.id);
          const search = Array.from(params.keys()).length ? `?${params.toString()}` : ``;
          const url = `${location.pathname}${search}${location.hash}`;
          if (!cachePromises.has(url)) {
            debug(`Caching data for`, url);
            cachePromises.set(url, dataCache.add(url).catch((error) => {
              debug(`Failed to cache data for ${url}:`, error);
            }));
          }
        }
      }
    }
  }
  await Promise.all(cachePromises.values());
}
self.addEventListener(`push`, function(event) {
  var _a, _b;
  debug(`self.addEventListener(push)`);
  if (window.Notification && window.Notification.permission === `granted`) {
    const payload = (_b = (_a = event.data) == null ? void 0 : _a.json()) != null ? _b : { body: ``, title: `No Payload` };
    debug(`self.addEventListener(push)`, { payload });
    event.waitUntil(handleNotificationAsync(payload));
  }
});
async function handleNotificationAsync(payload) {
  if (`Notification` in window && navigator.serviceWorker) {
    if (Notification.permission !== `granted` && Notification.permission !== `denied`) {
      await Notification.requestPermission().then((status) => {
        debug(`Notification permission request status`, status);
      });
    }
    if (Notification.permission === `granted`) {
      self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: `/icons/favicon-196x196.png`,
        vibrate: [100, 50, 100, 50, 100]
      });
    }
  }
}
function debug(...messages) {
  if (true) {
    console.debug(...messages);
  }
}
/**
 * @remix-run/server-runtime v1.4.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
