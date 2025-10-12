import { useState } from "react";
import useSWR from "swr";
import {
   fetchLeaveRequests,
   fetchLeaveRequestById,
   fetchLeaveRequestsByUserId,
   createLeaveRequest,
   updateLeaveRequest,
   deleteLeaveRequest,
   approveLeaveRequest,
   rejectLeaveRequest,
   cancelLeaveRequest,
} from "@/api/leaveRequestServices";

// SWR Hook for fetching all leave requests with optional filters
export const useLeaveRequests = (filters?: any) => {
   const key = filters ? ["leaveRequests", filters] : "leaveRequests";

   const { data, error, mutate } = useSWR(
      key,
      () => fetchLeaveRequests(filters),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      leaveRequests: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single leave request by its ID
export const useLeaveRequestById = (leaveRequestId: number) => {
   const { data, error, isLoading } = useSWR(
      leaveRequestId ? `/leave-request/${leaveRequestId}` : null,
      () => fetchLeaveRequestById(leaveRequestId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      leaveRequest: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook for fetching leave requests for a specific user with optional filters
export const useLeaveRequestsByUser = (
   userId: number | undefined,
   filters?: any
) => {
   const key = userId ? [`/leave-request/user/${userId}`, filters] : null;

   const { data, error, mutate } = useSWR(
      key,
      () =>
         userId
            ? fetchLeaveRequestsByUserId(userId, filters)
            : Promise.resolve(null),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      userLeaveRequests: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for creating a leave request
export const useCreateLeaveRequest = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (leaveRequestData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createLeaveRequest(leaveRequestData);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createLeaveRequest: create,
      isCreating,
      error,
   };
};

// SWR Hook for updating a leave request
export const useUpdateLeaveRequest = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (
      leaveRequestId: number | string,
      updatedData: FormData
   ) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateLeaveRequest(leaveRequestId, updatedData);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateLeaveRequest: update,
      isUpdating,
      error,
   };
};

// SWR Hook for deleting a leave request
export const useDeleteLeaveRequest = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const deleteRecord = async (leaveRequestId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteLeaveRequest(leaveRequestId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteLeaveRequest: deleteRecord,
      isDeleting,
      error,
   };
};

// SWR Hook for approving a leave request
export const useApproveLeaveRequest = () => {
   const [isApproving, setIsApproving] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const approve = async (leaveRequestId: number | string) => {
      setIsApproving(true);
      setError(null);
      try {
         const response = await approveLeaveRequest(leaveRequestId);
         setIsApproving(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsApproving(false);
         throw err;
      }
   };

   return {
      approveLeaveRequest: approve,
      isApproving,
      error,
   };
};

// SWR Hook for rejecting a leave request
export const useRejectLeaveRequest = () => {
   const [isRejecting, setIsRejecting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const reject = async (leaveRequestId: number | string) => {
      setIsRejecting(true);
      setError(null);
      try {
         const response = await rejectLeaveRequest(leaveRequestId);
         setIsRejecting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsRejecting(false);
         throw err;
      }
   };

   return {
      rejectLeaveRequest: reject,
      isRejecting,
      error,
   };
};

// SWR Hook for canceling a leave request
export const useCancelLeaveRequest = () => {
   const [isCanceling, setIsCanceling] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const cancel = async (leaveRequestId: number | string) => {
      setIsCanceling(true);
      setError(null);
      try {
         const response = await cancelLeaveRequest(leaveRequestId);
         setIsCanceling(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCanceling(false);
         throw err;
      }
   };

   return {
      cancelLeaveRequest: cancel,
      isCanceling,
      error,
   };
};

export function useUserLeaveRequests(userId?: number, page = 1, size = 10) {
   const commonParams = { page, size, include: "leaveUser,approver" };

   const all = useLeaveRequestsByUser(userId, { ...commonParams, status: "" });
   const approved = useLeaveRequestsByUser(userId, {
      ...commonParams,
      status: "approved",
   });
   const rejected = useLeaveRequestsByUser(userId, {
      ...commonParams,
      status: "rejected",
   });
   const canceled = useLeaveRequestsByUser(userId, {
      ...commonParams,
      status: "canceled",
   });
   const pending = useLeaveRequestsByUser(userId, {
      ...commonParams,
      status: "pending",
   });

   return {
      all,
      approved,
      rejected,
      canceled,
      pending,
   };
}
