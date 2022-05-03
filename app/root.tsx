import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ThrownResponse } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useLocation, useMatches } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getIsDarkModeSessionAsync } from "./utils";

export const links: LinksFunction = () => {
  return [
    {
      href: `/icons/android-icon-48x48.png`,
      rel: `icon`,
      sizes: `48x48`,
      type: `image/png`,
    },
    {
      href: `/icons/android-icon-72x72.png`,
      rel: `icon`,
      sizes: `72x72`,
      type: `image/png`,
    },
    {
      href: `/icons/android-icon-96x96.png`,
      rel: `icon`,
      sizes: `96x96`,
      type: `image/png`,
    },
    {
      href: `/icons/android-icon-144x144.png`,
      rel: `icon`,
      sizes: `144x144`,
      type: `image/png`,
    },
    {
      href: `/icons/android-icon-192x192.png`,
      rel: `icon`,
      sizes: `192x192`,
      type: `image/png`,
    },
    {
      href: `/icons/android-icon-512x512.png`,
      rel: `icon`,
      sizes: `512x512`,
      type: `image/png`,
    },
    {
      href: `/icons/apple-icon-16x16.png`,
      rel: `apple-touch-icon`,
      sizes: `16x16`,
    },
    {
      href: `/icons/apple-icon-20x20.png`,
      rel: `apple-touch-icon`,
      sizes: `20x20`,
    },
    {
      href: `/icons/apple-icon-29x29.png`,
      rel: `apple-touch-icon`,
      sizes: `29x29`,
    },
    {
      href: `/icons/apple-icon-32x32.png`,
      rel: `apple-touch-icon`,
      sizes: `32x32`,
    },
    {
      href: `/icons/apple-icon-40x40.png`,
      rel: `apple-touch-icon`,
      sizes: `40x40`,
    },
    {
      href: `/icons/apple-icon-50x50.png`,
      rel: `apple-touch-icon`,
      sizes: `50x50`,
    },
    {
      href: `/icons/apple-icon-57x57.png`,
      rel: `apple-touch-icon`,
      sizes: `57x57`,
    },
    {
      href: `/icons/apple-icon-58x58.png`,
      rel: `apple-touch-icon`,
      sizes: `58x58`,
    },
    {
      href: `/icons/apple-icon-60x60.png`,
      rel: `apple-touch-icon`,
      sizes: `60x60`,
    },
    {
      href: `/icons/apple-icon-64x64.png`,
      rel: `apple-touch-icon`,
      sizes: `64x64`,
    },
    {
      href: `/icons/apple-icon-72x72.png`,
      rel: `apple-touch-icon`,
      sizes: `72x72`,
    },
    {
      href: `/icons/apple-icon-76x76.png`,
      rel: `apple-touch-icon`,
      sizes: `76x76`,
    },
    {
      href: `/icons/apple-icon-80x80.png`,
      rel: `apple-touch-icon`,
      sizes: `80x80`,
    },
    {
      href: `/icons/apple-icon-87x87.png`,
      rel: `apple-touch-icon`,
      sizes: `87x87`,
    },
    {
      href: `/icons/apple-icon-100x100.png`,
      rel: `apple-touch-icon`,
      sizes: `100x100`,
    },
    {
      href: `/icons/apple-icon-114x114.png`,
      rel: `apple-touch-icon`,
      sizes: `114x114`,
    },
    {
      href: `/icons/apple-icon-120x120.png`,
      rel: `apple-touch-icon`,
      sizes: `120x120`,
    },
    {
      href: `/icons/apple-icon-128x128.png`,
      rel: `apple-touch-icon`,
      sizes: `128x128`,
    },
    {
      href: `/icons/apple-icon-144x144.png`,
      rel: `apple-touch-icon`,
      sizes: `144x144`,
    },
    {
      href: `/icons/apple-icon-152x152.png`,
      rel: `apple-touch-icon`,
      sizes: `152x152`,
    },
    {
      href: `/icons/apple-icon-167x167.png`,
      rel: `apple-touch-icon`,
      sizes: `167x167`,
    },
    {
      href: `/icons/apple-icon-180x180.png`,
      rel: `apple-touch-icon`,
      sizes: `180x180`,
    },
    {
      href: `/icons/apple-icon-192x192.png`,
      rel: `apple-touch-icon`,
      sizes: `192x192`,
    },
    {
      href: `/icons/apple-icon-256x256.png`,
      rel: `apple-touch-icon`,
      sizes: `256x256`,
    },
    {
      href: `/icons/apple-icon-512x512.png`,
      rel: `apple-touch-icon`,
      sizes: `512x512`,
    },
    {
      href: `/icons/apple-icon-1024x1024.png`,
      rel: `apple-touch-icon`,
      sizes: `1024x1024`,
    },
    {
      href: `/icons/apple-splash-2048-2732.jpg`,
      media: `(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2732-2048.jpg`,
      media: `(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1668-2388.jpg`,
      media: `(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2388-1668.jpg`,
      media: `(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1536-2048.jpg`,
      media: `(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2048-1536.jpg`,
      media: `(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1668-2224.jpg`,
      media: `(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2224-1668.jpg`,
      media: `(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1620-2160.jpg`,
      media: `(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2160-1620.jpg`,
      media: `(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1284-2778.jpg`,
      media: `(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2778-1284.jpg`,
      media: `(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1170-2532.jpg`,
      media: `(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2532-1170.jpg`,
      media: `(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1125-2436.jpg`,
      media: `(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2436-1125.jpg`,
      media: `(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1242-2688.jpg`,
      media: `(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2688-1242.jpg`,
      media: `(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-828-1792.jpg`,
      media: `(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1792-828.jpg`,
      media: `(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1242-2208.jpg`,
      media: `(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-2208-1242.jpg`,
      media: `(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-750-1334.jpg`,
      media: `(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1334-750.jpg`,
      media: `(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-640-1136.jpg`,
      media: `(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/apple-splash-1136-640.jpg`,
      media: `(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)`,
      rel: `apple-touch-startup-image`,
    },
    {
      href: `/icons/favicon-196x196.png`,
      rel: `icon`,
      sizes: `196x196`,
      type: `image/png`,
    },
    {
      href: `/resources/manifest.json`,
      rel: `manifest`,
    },
    {
      href: tailwindStylesheetUrl,
      rel: `stylesheet`,
    },
  ];
};

interface IRootRouteLoaderData {
  isDarkMode: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const isDarkModeSession = await getIsDarkModeSessionAsync(request);

  return json<IRootRouteLoaderData>({
    isDarkMode: Boolean(isDarkModeSession.get()),
  });
};

export const meta: MetaFunction = () => ({
  [`apple-mobile-web-app-capable`]: `yes`,
  charset: `utf-8`,
  [`theme-color`]: `#000000`,
  viewport: `width=device-width,initial-scale=1`,
});

export default function App() {
  const loaderData = useLoaderData<IRootRouteLoaderData>();
  return <Document body={<Outlet />} isDarkMode={loaderData.isDarkMode} />;
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, string>>();

  return (
    <Document
      body={
        <section className="px-8">
          <h1 className="text-4xl text-slate-800">{caught.status}</h1>
          <h2 className="text-xl text-slate-800">{caught.statusText}</h2>
        </section>
      }
      head={<title>{caught.data}</title>}
    />
  );
}

interface IErrorBoundaryProps {
  error: Error;
}

export function ErrorBoundary({ error }: IErrorBoundaryProps) {
  return (
    <Document
      body={
        <>
          <h1>Something went wrong</h1>
          <p>{JSON.stringify(error, null, 2)}</p>
        </>
      }
      head={<title>{error.message}</title>}
    />
  );
}

interface IDocumentProps {
  body: ReactNode;
  head?: ReactNode;
  isDarkMode?: boolean;
}

function Document({ body, head, isDarkMode }: IDocumentProps) {
  useSetupServiceWorker();

  return (
    <html lang="en" className={`${isDarkMode ? `dark ` : ``}min-h-full`}>
      <head>
        <Meta />
        <Links />
        {head}
      </head>
      <body className="min-h-full bg-slate-50 dark:bg-slate-800">
        {body}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <a
          className="mt-96 block w-full p-8 text-center text-slate-800 dark:text-slate-50"
          href="https://www.flaticon.com/free-icons/holy"
          rel="noopener noreferrer"
          target="_blank"
          title="Holy icons"
        >
          Holy icons created by Freepik - Flaticon
        </a>
      </body>
    </html>
  );
}

function useSetupServiceWorker() {
  const location = useLocation();
  const matches = useMatches();
  const isMount = useRef(true);

  useEffect(() => {
    const mounted = isMount.current;
    isMount.current = false;

    if (`serviceWorker` in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: `REMIX_NAVIGATION`,
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        const listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: `REMIX_NAVIGATION`,
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };

        navigator.serviceWorker.addEventListener(`controllerchange`, listener);

        return () => {
          navigator.serviceWorker.removeEventListener(
            `controllerchange`,
            listener
          );
        };
      }
    }
  }, [location, matches]);
}
