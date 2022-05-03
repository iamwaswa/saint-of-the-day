/// <reference lib="WebWorker" />

import { json } from "@remix-run/server-runtime";

export type {};
declare const self: ServiceWorkerGlobalScope;

const STATIC_ASSETS = ["/build/", "/icons/"];
const ASSET_CACHE = "asset-cache";
const DATA_CACHE = "data-cache";
const DOCUMENT_CACHE = "document-cache";

/**
 * Activate
 */

self.addEventListener(`activate`, (event) => {
  event.waitUntil(handleActivateAsync(event).then(() => self.clients.claim()));
});

async function handleActivateAsync(_: ExtendableEvent) {
  debug(`Service worker activated`);
}

/**
 * Fetch
 */

self.addEventListener(`fetch`, (event) => {
  event.respondWith(
    (async () => {
      const result = {} as
        | { error: unknown; response: undefined }
        | { error: undefined; response: Response };
      try {
        result.response = await handleFetchAsync(event);
      } catch (error) {
        result.error = error;
      }

      return appHandleFetch(event, result);
    })()
  );
});

async function handleFetchAsync(event: FetchEvent): Promise<Response> {
  const url = new URL(event.request.url);

  if (isAssetRequest(event.request)) {
    const cached = await caches.match(event.request, {
      cacheName: ASSET_CACHE,
      ignoreVary: true,
      ignoreSearch: true,
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
      debug(
        `Serving data from network failed, falling back to cache`,
        url.pathname + url.search
      );
      const response = await caches.match(event.request);
      if (response) {
        response.headers.set(`X-Remix-Worker`, `yes`);
        return response;
      }

      return json(
        { message: `Network Error` },
        {
          status: 500,
          headers: {
            [`X-Remix-Catch`]: `yes`,
            [`X-Remix-Worker`]: `yes`,
          },
        }
      );
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
      debug(
        `Serving document from network failed, falling back to cache`,
        url.pathname
      );
      let response = await caches.match(event.request);
      if (response) {
        return response;
      }
      throw error;
    }
  }

  return fetch(event.request.clone());
}

function isAssetRequest(request: Request): boolean {
  return (
    isMethod(request, `get`) &&
    STATIC_ASSETS.some((publicPath) => request.url.startsWith(publicPath))
  );
}

function isLoaderRequest(request: Request) {
  let url = new URL(request.url);
  return isMethod(request, `get`) && url.searchParams.get(`_data`);
}

function isDocumentGetRequest(request: Request) {
  return isMethod(request, `get`) && request.mode === `navigate`;
}

function isMethod(request: Request, ...methods: string[]): boolean {
  return methods.includes(request.method.toLowerCase());
}

async function appHandleFetch(
  event: FetchEvent,
  {
    error,
    response,
  }:
    | { error: unknown; response: undefined }
    | { error: undefined; response: Response }
): Promise<Response> {
  debug(event, error);
  return response ?? new Response();
}

/**
 * Install
 */

self.addEventListener(`install`, (event) => {
  event.waitUntil(handleInstallAsync(event).then(() => self.skipWaiting()));
});

async function handleInstallAsync(_: ExtendableEvent) {
  debug(`Service worker installed`);
}

/**
 * Message
 */

self.addEventListener(`message`, (event) => {
  event.waitUntil(handleMessageAsync(event));
});

async function handleMessageAsync(event: ExtendableMessageEvent) {
  const cachePromises: Map<string, Promise<void>> = new Map();

  if (event.data.type === `REMIX_NAVIGATION`) {
    const { isMount, location, matches, manifest } = event.data;
    const documentUrl = location.pathname + location.search + location.hash;

    const [dataCache, documentCache, existingDocument] = await Promise.all([
      caches.open(DATA_CACHE),
      caches.open(DOCUMENT_CACHE),
      caches.match(documentUrl),
    ]);

    if (!existingDocument || !isMount) {
      debug(`Caching document for`, documentUrl);
      cachePromises.set(
        documentUrl,
        documentCache.add(documentUrl).catch((error) => {
          debug(`Failed to cache document for ${documentUrl}:`, error);
        })
      );
    }

    if (isMount) {
      for (const match of matches) {
        if (manifest.routes[match.id].hasLoader) {
          const params = new URLSearchParams(location.search);
          params.set(`_data`, match.id);
          const search = Array.from(params.keys()).length
            ? `?${params.toString()}`
            : ``;
          const url = `${location.pathname}${search}${location.hash}`;

          if (!cachePromises.has(url)) {
            debug(`Caching data for`, url);
            cachePromises.set(
              url,
              dataCache.add(url).catch((error) => {
                debug(`Failed to cache data for ${url}:`, error);
              })
            );
          }
        }
      }
    }
  }

  await Promise.all(cachePromises.values());
}

function debug(...messages: any[]) {
  if (process.env.NODE_ENV === `development`) {
    console.debug(...messages);
  }
}
