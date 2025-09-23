import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";

// Fetch all attendance details (Admin only)
export const fetchAttendanceDetails = async (filters: any) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/attendance-details", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error fetching attendance details"
      );
   }
};

// Fetch attendance detail by ID
export const fetchAttendanceDetailById = async (attendanceDetailId: number) => {
   try {
      const response = await axiosInstance.get(
         `/attendance-detail/${attendanceDetailId}`
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            "Error fetching attendance detail by ID"
      );
   }
};

// Fetch attendance detail by attendance ID
export const fetchAttendanceDetailByAttendanceId = async (
   attendanceId: number,
   filters: any
) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get(
         `/attendance-detail/attendance/${attendanceId}`,
         {
            params: queryParams,
         }
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            `Error fetching attendance detail for attendance ${attendanceId}`
      );
   }
};

// Create a new attendance detail
export const createAttendanceDetail = async (
   attendanceDetailData: FormData
) => {
   try {
      const response = await axiosInstance.post(
         "/attendance-detail",
         attendanceDetailData
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error creating attendance detail"
      );
   }
};

// Update an attendance detail
export const updateAttendanceDetail = async (
   attendanceDetailId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/attendance-detail/${attendanceDetailId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error updating attendance detail"
      );
   }
};

// Delete an attendance detail
export const deleteAttendanceDetail = async (
   attendanceDetailId: number | string
) => {
   try {
      const response = await axiosInstance.delete(
         `/attendance-detail/${attendanceDetailId}`
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error deleting attendance detail"
      );
   }
};

// User check-in
export const userCheckIn = async (checkInData: any) => {
   try {
      const response = await axiosInstance.post("/check-in", checkInData);
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error during check-in"
      );
   }
};

// User check-out
export const userCheckOut = async (checkOutData: any) => {
   try {
      const response = await axiosInstance.post("/check-out", checkOutData);
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error during check-out"
      );
   }
};
