import { useState } from "react";
import useSWR from "swr";
import {
   fetchAttendances,
   fetchAttendanceById,
   fetchAttendancesByUserId,
   createAttendance,
   updateAttendance,
   deleteAttendance,
} from "@/api/attendanceServices";

// SWR Hook for fetching all attendances with optional filters
export const useAttendances = (filters?: any) => {
   const key = filters ? ["attendances", filters] : "attendances";

   const { data, error, mutate } = useSWR(
      key,
      () => fetchAttendances(filters),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendances: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single attendance by its ID
export const useAttendanceById = (attendanceId: number) => {
   const { data, error, isLoading } = useSWR(
      attendanceId ? `/attendance/${attendanceId}` : null,
      () => fetchAttendanceById(attendanceId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendance: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook for fetching a user's attendances with optional filters
export const useAttendanceByUser = (
   userId: number | undefined,
   filters?: any
) => {
   const key = userId ? [`/attendances/user/${userId}`, filters] : null;

   const { data, error, mutate } = useSWR(
      key,
      () =>
         userId
            ? fetchAttendancesByUserId(userId, filters)
            : Promise.resolve(null),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      userAttendances: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for creating an attendance
export const useCreateAttendance = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (attendanceData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createAttendance(attendanceData);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createAttendance: create,
      isCreating,
      error,
   };
};

// SWR Hook for updating an attendance
export const useUpdateAttendance = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (
      attendanceId: number | string,
      updatedData: FormData
   ) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateAttendance(attendanceId, updatedData);
         setIsUpdating(false);
         return response; // Return the updated attendance data
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateAttendance: update,
      isUpdating,
      error,
   };
};

// SWR Hook for deleting an attendance
export const useDeleteAttendance = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const deleteRecord = async (attendanceId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteAttendance(attendanceId);
         setIsDeleting(false);
         return response; // Return confirmation message
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteAttendance: deleteRecord,
      isDeleting,
      error,
   };
};
