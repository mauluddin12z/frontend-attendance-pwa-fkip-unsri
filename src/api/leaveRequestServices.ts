import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all leave requests (Admin only)
export const fetchLeaveRequests = async (filters: any) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/leave-requests", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching leave requests");
   }
};

// Fetch leave request by ID
export const fetchLeaveRequestById = async (leaveRequestId: number) => {
   try {
      const response = await axiosInstance.get(
         `/leave-request/${leaveRequestId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching leave request by ID");
   }
};

// Fetch leave requests for a specific user
export const fetchLeaveRequestsByUserId = async (
   userId: number,
   filters: any
) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get(
         `/leave-request/user/${userId}`,
         {
            params: queryParams,
         }
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(
         error,
         `Error fetching leave requests for user ${userId}`
      );
   }
};

// Create a new leave request
export const createLeaveRequest = async (leaveRequestData: FormData) => {
   try {
      const response = await axiosInstance.post(
         "/leave-request",
         leaveRequestData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating leave request");
   }
};

// Approve a leave request
export const approveLeaveRequest = async (
   leaveRequestId: number | string,
   leaveRequestData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/approve-leave-request/${leaveRequestId}`,
         leaveRequestData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error approving leave request");
   }
};

// Reject a leave request
export const rejectLeaveRequest = async (
   leaveRequestId: number | string,
   leaveRequestData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/reject-leave-request/${leaveRequestId}`,
         leaveRequestData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error rejecting leave request");
   }
};

// Cancel a leave request
export const cancelLeaveRequest = async (leaveRequestId: number | string) => {
   try {
      const response = await axiosInstance.patch(
         `/cancel-leave-request/${leaveRequestId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error canceling leave request");
   }
};

// Update a leave request
export const updateLeaveRequest = async (
   leaveRequestId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/leave-request/${leaveRequestId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating leave request");
   }
};

// Delete a leave request
export const deleteLeaveRequest = async (leaveRequestId: number | string) => {
   try {
      const response = await axiosInstance.delete(
         `/leave-request/${leaveRequestId}`
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting leave request");
   }
};
