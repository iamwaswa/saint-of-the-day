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

    if (isJustAfterMidnight()) {
      await pushNotificationAsync({
        body: `It's a new day. Have a look at the Saint for today!`,
        title: `Saint Of The Day`,
      });
    }

    return new Response(`OK`);
  } catch (error: unknown) {
    console.log(`healthcheck ❌`, { error });
    return new Response(`ERROR`, { status: 500 });
  }
};

function isJustAfterMidnight(): boolean {
  const date = new Date();
  return date.getHours() === 0 && date.getMinutes() === 1;
}
