import { useState } from "react";
import useSWR from "swr";
import {
   fetchHolidays,
   fetchHolidayById,
   createHoliday,
   updateHoliday,
   deleteHoliday,
} from "@/api/holidayServices";

// SWR Hook for fetching all holidays with optional filters
export const useHolidays = (filters?: any) => {
   const key = filters ? ["holidays", filters] : "holidays";

   const {
      data: response,
      error,
      mutate,
   } = useSWR(key, () => fetchHolidays(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      holidays: response,
      isLoading: !response && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single holiday by ID
export const useHolidayById = (holidayId: number | string | null) => {
   const { data, error, isLoading } = useSWR(
      holidayId ? `/holiday/${holidayId}` : null,
      () => fetchHolidayById(holidayId!),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      holiday: data,
      isLoading,
      isError: !!error,
   };
};

// Hook for creating a holiday
export const useCreateHoliday = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (data: any) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createHoliday(data);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createHoliday: create,
      isCreating,
      error,
   };
};

// Hook for updating a holiday
export const useUpdateHoliday = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (holidayId: number | string, data: any) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateHoliday(holidayId, data);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateHoliday: update,
      isUpdating,
      error,
   };
};

// Hook for deleting a holiday
export const useDeleteHoliday = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const remove = async (holidayId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteHoliday(holidayId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteHoliday: remove,
      isDeleting,
      error,
   };
};
