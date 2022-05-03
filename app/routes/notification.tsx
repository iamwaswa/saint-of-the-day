// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunction } from "@remix-run/node";
import { pushNotificationAsync } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const host =
    request.headers.get(`X-Forwarded-Host`) ?? request.headers.get(`host`);

  try {
    const url = new URL(`/`, `http://${host}`);
    // if we can make a HEAD request to ourselves, then we're good.
    await fetch(url.toString(), { method: `HEAD` }).then((r) => {
      if (!r.ok) return Promise.reject(r);
    });

    const date = new Date();

    if (date.getHours() === 23 && date.getMinutes() === 59) {
      await pushNotificationAsync({
        body: `There is a new saint of the day!`,
        title: `Saint Of The Day`,
      });
    }

    return new Response(`OK`);
  } catch (error: unknown) {
    console.log(`healthcheck ❌`, { error });
    return new Response(`ERROR`, { status: 500 });
  }
};
