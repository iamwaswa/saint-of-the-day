import type { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = () => {
  return new Response(process.env.VAPID_PUBLIC_KEY, {
    headers: {
      [`Content-Type`]: `text/html`,
    },
  });
};
