// utils/notification.ts
export const requestNotificationPermission = async () => {
   if ("Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
   }
};

export const showNotification = (
   title: string,
   options?: NotificationOptions
) => {
   if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
   }
};
