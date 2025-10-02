import { useState } from "react";
import useSWR from "swr";
import {
   fetchAttendanceDetails,
   fetchAttendanceDetailById,
   fetchAttendanceDetailByAttendanceId,
   createAttendanceDetail,
   updateAttendanceDetail,
   deleteAttendanceDetail,
   userCheckIn,
   userCheckOut,
} from "@/api/attendanceDetailServices";

// SWR Hook for fetching all attendance details with optional filters
export const useAttendanceDetails = (filters?: any) => {
   const key = filters ? ["attendance-details", filters] : "attendance-details";

   const { data, error, mutate } = useSWR(
      key,
      () => fetchAttendanceDetails(filters),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendanceDetails: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single attendance detail by its ID
export const useAttendanceDetailById = (attendanceDetailId: number) => {
   const { data, error, isLoading } = useSWR(
      attendanceDetailId ? `/attendance-detail/${attendanceDetailId}` : null,
      () => fetchAttendanceDetailById(attendanceDetailId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendanceDetail: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook for fetching attendance details by attendance ID with optional filters
export const useAttendanceDetailByAttendanceId = (
   attendanceId: number,
   filters?: any
) => {
   const key = attendanceId
      ? [`/attendance-detail/attendance/${attendanceId}`, filters]
      : null;

   const { data, error } = useSWR(
      key,
      () => fetchAttendanceDetailByAttendanceId(attendanceId, filters),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      attendanceDetailsByAttendanceId: data,
      isLoading: !data && !error,
      isError: !!error,
   };
};

// SWR Hook for creating an attendance detail
export const useCreateAttendanceDetail = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (attendanceDetailData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createAttendanceDetail(attendanceDetailData);
         setIsCreating(false);
         return response; // Return the created attendance detail
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createAttendanceDetail: create,
      isCreating,
      error,
   };
};

// SWR Hook for updating an attendance detail
export const useUpdateAttendanceDetail = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (
      attendanceDetailId: number | string,
      updatedData: FormData
   ) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateAttendanceDetail(
            attendanceDetailId,
            updatedData
         );
         setIsUpdating(false);
         return response; // Return the updated attendance detail
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateAttendanceDetail: update,
      isUpdating,
      error,
   };
};

// SWR Hook for deleting an attendance detail
export const useDeleteAttendanceDetail = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const deleteRecord = async (attendanceDetailId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteAttendanceDetail(attendanceDetailId);
         setIsDeleting(false);
         return response; // Return confirmation message
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteAttendanceDetail: deleteRecord,
      isDeleting,
      error,
   };
};

// SWR Hook for user check-in
export const useUserCheckIn = () => {
   const [isCheckingIn, setIsCheckingIn] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const checkIn = async (checkInData: any) => {
      setIsCheckingIn(true);
      setError(null);
      try {
         const response = await userCheckIn(checkInData);
         setIsCheckingIn(false);
         return response; // Return check-in confirmation
      } catch (err: any) {
         setError(err);
         setIsCheckingIn(false);
         throw err;
      }
   };

   return {
      checkIn: checkIn,
      isCheckingIn,
      error,
   };
};

// SWR Hook for user check-out
export const useUserCheckOut = () => {
   const [isCheckingOut, setIsCheckingOut] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const checkOut = async (checkOutData: any) => {
      setIsCheckingOut(true);
      setError(null);
      try {
         const response = await userCheckOut(checkOutData);
         setIsCheckingOut(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCheckingOut(false);
         throw err;
      }
   };

   return {
      checkOut: checkOut,
      isCheckingOut,
      error,
   };
};
