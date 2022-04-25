// Send a client notification to the user

interface NotificationOptions {
  body: string | `Notification body`;
  badge?: string;
  icon?: string;
  image?: string;
  silent: boolean | false;
}

export async function sendNotificationAsync(
  title: string,
  options: NotificationOptions
) {
  try {
    if (`Notification` in window) {
      const permissions = (
        await navigator.permissions.query({ name: `notifications` })
      ).state;
      navigator.permissions
        .query({ name: `notifications` })
        .then((permissionStatus) => {
          if (permissionStatus.state === `granted`) {
            return;
          } else {
            return Notification.requestPermission();
          }
        });

      if (permissions === `granted`) {
        await navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options);
          return {
            status: `success`,
            message: `Sent Notification to user successfully`,
          };
        });
      } else {
        return {
          status: `bad`,
          message: `Denied access to sending notifications!`,
        };
      }
    } else {
      return {
        status: `bad`,
        message: `Notification API not supported`,
      };
    }
  } catch (error) {
    console.debug(error);
    throw new Error(`Error sending notification!`);
  }
}
