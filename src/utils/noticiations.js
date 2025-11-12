// src/utils/notifications.js
import * as Notifications from 'expo-notifications';

export async function clearMessageNotifications() {
  try {
    await Notifications.dismissAllNotificationsAsync(); // clears delivered notifs
    await Notifications.setBadgeCountAsync(0); // clears app icon badge
  } catch (e) {
    // no-op
  }
}
