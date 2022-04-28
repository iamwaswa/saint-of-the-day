const storage = require("node-persist");

export async function saveSubscriptionAsync(
  subscription: PushSubscription
): Promise<void> {
  await storage.init();
  await storage.setItem("subscription", subscription);
}
