import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json(
    {
      short_name: `SOTD`,
      name: `Saint Of The Day`,
      start_url: `/`,
      display: `standalone`,
      background_color: `#ffffff`,
      theme_color: `#000000`,
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
    },
    {
      headers: {
        [`Cache-Control`]: `public, max-age=600`,
      },
    }
  );
};
