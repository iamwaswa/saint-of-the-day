import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json(
    {
      background_color: `#ffffff`,
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
      theme_color: `#000000`,
    },
    {
      headers: {
        [`Cache-Control`]: `public, max-age=600`,
      },
    }
  );
};
