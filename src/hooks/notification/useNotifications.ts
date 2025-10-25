import { useState } from "react";
import useSWR from "swr";
import {
   fetchNotifications,
   fetchNotificationById,
   createNotification,
   markNotificationAsRead,
   markAllNotificationsAsRead,
   fetchUnreadNotificationCount,
   deleteNotification,
   deleteAllNotifications,
   fetchNotificationsByUserId,
} from "@/api/notificationServices";

// SWR Hook for fetching all notifications
export const useNotifications = (filters?: any) => {
   const key = filters ? ["notifications", filters] : "notifications";

   const { data, error, mutate } = useSWR(
      key,
      () => fetchNotifications(filters),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      notifications: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a user's notifications with optional filters
export const useNotificationByUser = (
   userId: number | undefined,
   filters?: any
) => {
   const key = userId ? [`/notifications/user/${userId}`, filters] : null;

   const { data, error, mutate } = useSWR(
      key,
      () =>
         userId
            ? fetchNotificationsByUserId(userId, filters)
            : Promise.resolve(null),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      userNotifications: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single notification by ID
export const useNotificationById = (notificationId?: number | string) => {
   const { data, error, isLoading } = useSWR(
      notificationId ? `/notification/${notificationId}` : null,
      () => fetchNotificationById(notificationId!),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      notification: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook for creating a notification
export const useCreateNotification = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (data: FormData | Record<string, any>) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createNotification(data);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createNotification: create,
      isCreating,
      error,
   };
};

// SWR Hook for marking a notification as read
export const useMarkNotificationAsRead = () => {
   const [isMarking, setIsMarking] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const markAsRead = async (notificationId: number | string) => {
      setIsMarking(true);
      setError(null);
      try {
         const response = await markNotificationAsRead(notificationId);
         setIsMarking(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsMarking(false);
         throw err;
      }
   };

   return {
      markNotificationAsRead: markAsRead,
      isMarking,
      error,
   };
};

// SWR Hook for marking all notifications as read
export const useMarkAllNotificationsAsRead = () => {
   const [isMarkingAll, setIsMarkingAll] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const markAll = async () => {
      setIsMarkingAll(true);
      setError(null);
      try {
         const response = await markAllNotificationsAsRead();
         setIsMarkingAll(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsMarkingAll(false);
         throw err;
      }
   };

   return {
      markAllNotificationsAsRead: markAll,
      isMarkingAll,
      error,
   };
};

// SWR Hook for fetching unread notification count
export const useUnreadNotificationCount = () => {
   const { data, error, mutate } = useSWR(
      "unreadNotificationCount",
      fetchUnreadNotificationCount,
      {
         revalidateOnFocus: true,
         refreshInterval: 30000, // refresh every 30s
      }
   );

   return {
      unreadCount: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for deleting a notification
export const useDeleteNotification = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const remove = async (notificationId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteNotification(notificationId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteNotification: remove,
      isDeleting,
      error,
   };
};

// SWR Hook for deleting all notifications
export const useDeleteAllNotifications = () => {
   const [isDeletingAll, setIsDeletingAll] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const removeAll = async () => {
      setIsDeletingAll(true);
      setError(null);
      try {
         const response = await deleteAllNotifications();
         setIsDeletingAll(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeletingAll(false);
         throw err;
      }
   };

   return {
      deleteAllNotifications: removeAll,
      isDeletingAll,
      error,
   };
};
