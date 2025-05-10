import {
  notificationMessage,
  notificationType,
} from "$lib/stores/notification";

export function triggerNotification(
  message: string,
  type: "success" | "fail" | "standard",
) {
  notificationMessage.set(message);
  notificationType.set(type);
}
