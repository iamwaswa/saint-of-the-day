import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { fileSystemDatabase } from "~/packages";

export const action: ActionFunction = async ({ request }) => {
  const pushSubscription = await request.json();

  if (pushSubscription && typeof pushSubscription.endpoint === `string`) {
    await fileSystemDatabase.init();
    await fileSystemDatabase.setItem(`subscription`, pushSubscription);
  }

  return json({});
};
