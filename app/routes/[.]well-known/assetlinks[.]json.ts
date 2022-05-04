import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

export const loader: LoaderFunction = () => {
  return json([
    {
      relation: [`delegate_permission/common.handle_all_urls`],
      target: {
        namespace: `android_app`,
        package_name: `info.saintoftheday.twa`,
        sha256_cert_fingerprints: [
          `97:3B:59:E9:23:0F:C5:16:5A:33:5F:18:98:AB:FC:D8:CB:4D:CA:4B:E3:12:99:BB:5E:3C:41:A0:65:9C:CF:13`,
        ],
      },
    },
  ]);
};
