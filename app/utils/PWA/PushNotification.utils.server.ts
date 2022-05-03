import storage from "node-persist";
import webPush from "web-push";

interface IPushNotificationContent extends NotificationOptions {
  title: string;
}

export async function pushNotificationAsync(
  content: IPushNotificationContent,
  delay: number = 0
) {
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

  await storage.init();

  const subscription = await storage.getItem(`subscription`);

  setTimeout(() => {
    webPush
      .sendNotification(subscription, JSON.stringify(content))
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
  }, delay * 1000);
}
