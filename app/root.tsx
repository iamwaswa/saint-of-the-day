import type { LinksFunction, MetaFunction } from "@remix-run/node";
import type { ThrownResponse } from "@remix-run/react";
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

export const links: LinksFunction = () => {
  return [
    {
      href: `/icons/apple-icon-57x57.png`,
      rel: `apple-touch-icon`,
      sizes: `57x57`,
    },
    {
      href: `/icons/apple-icon-60x60.png`,
      rel: `apple-touch-icon`,
      sizes: `60x60`,
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
      href: `/icons/apple-icon-180x180.png`,
      rel: `apple-touch-icon`,
      sizes: `180x180`,
    },
    {
      href: `/icons/android-icon-192x192.png`,
      rel: `icon`,
      sizes: `192x192`,
      type: `image/png`,
    },
    {
      href: `/icons/favicon-32x32.png`,
      rel: `icon`,
      sizes: `32x32`,
      type: `image/png`,
    },
    {
      href: `/icons/favicon-96x96.png`,
      rel: `icon`,
      sizes: `96x96`,
      type: `image/png`,
    },
    {
      href: `/icons/favicon-16x16.png`,
      rel: `icon`,
      sizes: `16x16`,
      type: `image/png`,
    },
    { href: `/resources/manifest.json`, rel: `manifest` },
    { href: tailwindStylesheetUrl, rel: `stylesheet` },
  ];
};

export const meta: MetaFunction = () => ({
  charset: `utf-8`,
  [`theme-color`]: `#ffffff`,
  viewport: `width=device-width,initial-scale=1`,
});

export default function App() {
  return <Document body={<Outlet />} />;
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
}

function Document({ body, head }: IDocumentProps) {
  useSetupServiceWorker();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        {head}
      </head>
      <body className="h-full">
        {body}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
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
