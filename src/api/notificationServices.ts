import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all notifications (optionally with filters)
export const fetchNotifications = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/notifications", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching notifications");
   }
};

// Fetch Notifications for a specific user
export const fetchNotificationsByUserId = async (
   userId: number,
   filters: any
) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get(
         `/notifications/user/${userId}`,
         {
            params: queryParams,
         }
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(
         error,
         `Error fetching notifications for user ${userId}`
      );
   }
};

// Fetch a single notification by ID
export const fetchNotificationById = async (
   notificationId: number | string
) => {
   try {
      const response = await axiosInstance.get(
         `/notification/${notificationId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching notification by ID");
   }
};

// Create a new notification
export const createNotification = async (
   data: FormData | Record<string, any>
) => {
   try {
      const response = await axiosInstance.post("/notification", data);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating notification");
   }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (
   notificationId: number | string
) => {
   try {
      const response = await axiosInstance.patch(
         `/notification/${notificationId}/read`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error marking notification as read");
   }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
   try {
      const response = await axiosInstance.patch(
         "/notifications/mark-all-read"
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error marking all notifications as read");
   }
};

// Get unread notification count
export const fetchUnreadNotificationCount = async () => {
   try {
      const response = await axiosInstance.get("/notifications/unread-count");
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching unread notification count");
   }
};

// Delete a specific notification
export const deleteNotification = async (notificationId: number | string) => {
   try {
      const response = await axiosInstance.delete(
         `/notification/${notificationId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting notification");
   }
};

// Delete all notifications
export const deleteAllNotifications = async () => {
   try {
      const response = await axiosInstance.delete("/notifications/delete-all");
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting all notifications");
   }
};
