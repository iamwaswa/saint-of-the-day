import { fileSystemDatabase, webPush } from "~/packages";

interface IPushNotificationContent extends NotificationOptions {
  title: string;
}

export async function pushNotificationAsync(content: IPushNotificationContent) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
      `You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables. You can use the following ones:`
    );
    console.log(webPush.generateVAPIDKeys());
    return;
  }

  webPush.setVapidDetails(
    `https://serviceworke.rs/`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  await fileSystemDatabase.init();

  const pushSubscription = await fileSystemDatabase.getItem(`subscription`);

  console.log({ pushSubscription });

  webPush
    .sendNotification(pushSubscription, JSON.stringify(content))
    .then(() => {
      return new Response(`success`, {
        status: 200,
      });
    })
    .catch((e: unknown) => {
      console.log(e);
      return new Response(`Failed!`, {
        status: 500,
      });
    });
}
