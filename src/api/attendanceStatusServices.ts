import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all attendance statuses
export const fetchAttendanceStatuses = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/attendance-statuses", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching attendance statuses");
   }
};

// Fetch attendance status by ID
export const fetchAttendanceStatusById = async (statusId: number) => {
   try {
      const response = await axiosInstance.get(
         `/attendance-status/${statusId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching attendance status by ID");
   }
};

// Create a new attendance status
export const createAttendanceStatus = async (statusData: FormData) => {
   try {
      const response = await axiosInstance.post(
         "/attendance-status",
         statusData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating attendance status");
   }
};

// Update an existing attendance status
export const updateAttendanceStatus = async (
   statusId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/attendance-status/${statusId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating attendance status");
   }
};

// Delete an attendance status
export const deleteAttendanceStatus = async (statusId: number | string) => {
   try {
      const response = await axiosInstance.delete(
         `/attendance-status/${statusId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting attendance status");
   }
};
