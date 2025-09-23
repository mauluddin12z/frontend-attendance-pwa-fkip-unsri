import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all attendances (Admin only)
export const fetchAttendances = async (filters: any) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/attendances", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching attendances");
   }
};

// Fetch attendance by ID
export const fetchAttendanceById = async (attendanceId: number) => {
   try {
      const response = await axiosInstance.get(`/attendance/${attendanceId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching attendance by ID");
   }
};

// Fetch attendances for a specific user
export const fetchAttendancesByUserId = async (
   userId: number,
   filters: any
) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get(`/attendances/user/${userId}`, {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(
         error,
         `Error fetching attendances for user ${userId}`
      );
   }
};

// Create a new attendance
export const createAttendance = async (attendanceData: FormData) => {
   try {
      const response = await axiosInstance.post("/attendance", attendanceData);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating attendance");
   }
};

// Update an attendance
export const updateAttendance = async (
   attendanceId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/attendance/${attendanceId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating attendance");
   }
};

// Delete an attendance
export const deleteAttendance = async (attendanceId: number | string) => {
   try {
      const response = await axiosInstance.delete(
         `/attendance/${attendanceId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting attendance");
   }
};
