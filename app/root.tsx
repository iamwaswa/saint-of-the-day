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
import { useEffect, useRef } from "react";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  useSetupServiceWorker();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
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

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, string>>();

  return (
    <html lang="en" className="flex min-h-full flex-col">
      <head>
        <title>{caught.data}</title> <Meta /> <Links />
      </head>
      <body className="flex flex-grow flex-col bg-slate-100">
        <section className="px-8">
          <h1 className="text-4xl text-slate-800">{caught.status}</h1>
          <h2 className="text-xl text-slate-800">{caught.statusText}</h2>
        </section>
        <Scripts />
      </body>
    </html>
  );
}
