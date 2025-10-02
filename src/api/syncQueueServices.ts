import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all sync queues
export const fetchSyncQueues = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/sync-queues", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching sync queues");
   }
};

// Fetch a single sync queue by ID
export const fetchSyncQueueById = async (syncQueueId: number) => {
   try {
      const response = await axiosInstance.get(`/sync-queue/${syncQueueId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching sync queue by ID");
   }
};

// Create a new sync queue
export const createSyncQueue = async (data: FormData) => {
   try {
      const response = await axiosInstance.post("/sync-queue", data);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating sync queue");
   }
};

// Update an existing sync queue
export const updateSyncQueue = async (
   syncQueueId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/sync-queue/${syncQueueId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating sync queue");
   }
};

// Delete a sync queue
export const deleteSyncQueue = async (syncQueueId: number | string) => {
   try {
      const response = await axiosInstance.delete(`/sync-queue/${syncQueueId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting sync queue");
   }
};
