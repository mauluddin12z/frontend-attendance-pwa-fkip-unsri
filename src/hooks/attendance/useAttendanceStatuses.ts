import { useState } from "react";
import useSWR from "swr";
import {
   fetchAttendanceStatuses,
   fetchAttendanceStatusById,
   createAttendanceStatus,
   updateAttendanceStatus,
   deleteAttendanceStatus,
} from "@/api/attendanceStatusServices";

// SWR Hook: Get all attendance statuses
export const useAttendanceStatuses = (filters?: any) => {
   const key = filters ? ["attendanceStatuses", filters] : "attendanceStatuses";

   const { data, error, mutate } = useSWR(
      key,
      () => fetchAttendanceStatuses(filters),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendanceStatuses: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook: Get a single attendance status by ID
export const useAttendanceStatusById = (statusId: number) => {
   const { data, error, isLoading } = useSWR(
      statusId ? `/attendance-status/${statusId}` : null,
      () => fetchAttendanceStatusById(statusId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendanceStatus: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook: Create attendance status
export const useCreateAttendanceStatus = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (statusData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createAttendanceStatus(statusData);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createAttendanceStatus: create,
      isCreating,
      error,
   };
};

// SWR Hook: Update attendance status
export const useUpdateAttendanceStatus = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (statusId: number | string, updatedData: FormData) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateAttendanceStatus(statusId, updatedData);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateAttendanceStatus: update,
      isUpdating,
      error,
   };
};

// SWR Hook: Delete attendance status
export const useDeleteAttendanceStatus = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const deleteStatus = async (statusId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteAttendanceStatus(statusId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteAttendanceStatus: deleteStatus,
      isDeleting,
      error,
   };
};
