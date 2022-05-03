import { fileSystemDatabase, webPush } from "~/packages";

interface IPushNotificationContent extends NotificationOptions {
  title: string;
}

export async function pushNotificationAsync(content: IPushNotificationContent) {
  if (!process.env.GCM_API_KEY) {
    console.log(
      `You must set the GCM_API_KEY following the instructions here: https://pushalert.co/blog/how-to-get-gcm-api-key-project-number/`
    );
    return;
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log(
      `You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables. You can use the following ones:`
    );
    console.log(webPush.generateVAPIDKeys());
    return;
  }

  await fileSystemDatabase.init();

  const pushSubscription = await fileSystemDatabase.getItem(`subscription`);

  webPush
    .sendNotification(pushSubscription, JSON.stringify(content), {
      gcmAPIKey: process.env.GCM_API_KEY,
      TTL: 60,
      vapidDetails: {
        privateKey: process.env.VAPID_PRIVATE_KEY,
        publicKey: process.env.VAPID_PUBLIC_KEY,
        subject: `https://serviceworke.rs/`,
      },
    })
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
