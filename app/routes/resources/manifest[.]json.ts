import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getIsDarkModeSessionAsync } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const isDarkModeSession = await getIsDarkModeSessionAsync(request);
  const isDarkMode = Boolean(isDarkModeSession.get());
  const background_color = isDarkMode ? `#1e293b` : `#f8fafc`;
  const theme_color = isDarkMode ? `#f8fafc` : `#1e293b`;

  return json(
    {
      background_color,
      description: `Wanna know your saints? We have you covered, get to know the saint of the day on the Saint Of The Day App!`,
      display: `fullscreen`,
      icons: [
        {
          src: `/icons/manifest-icon-192.maskable.png`,
          sizes: `192x192`,
          type: `image/png`,
          purpose: `any`,
        },
        {
          src: `/icons/manifest-icon-192.maskable.png`,
          sizes: `192x192`,
          type: `image/png`,
          purpose: `maskable`,
        },
        {
          src: `/icons/manifest-icon-512.maskable.png`,
          sizes: `512x512`,
          type: `image/png`,
          purpose: `any`,
        },
        {
          src: `/icons/manifest-icon-512.maskable.png`,
          sizes: `512x512`,
          type: `image/png`,
          purpose: `maskable`,
        },
      ],
      orientation: `portrait`,
      name: `Saint Of The Day`,
      shortcuts: [
        {
          name: `Homepage`,
          url: `/`,
          icons: [
            {
              src: `/icons/android-icon-96x96.png`,
              sizes: `96x96`,
              type: `image/png`,
              purpose: `any monochrome`,
            },
          ],
        },
      ],
      short_name: `SOTD`,
      start_url: `/`,
      theme_color,
    },
    {
      headers: {
        [`Cache-Control`]: `public, max-age=600`,
      },
    }
  );
};
