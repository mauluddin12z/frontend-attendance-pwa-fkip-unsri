// hooks/useWorkingHours.ts

import { useState } from "react";
import useSWR from "swr";
import {
   fetchWorkingHours,
   fetchWorkingHourById,
   createWorkingHour,
   updateWorkingHour,
   deleteWorkingHour,
} from "@/api/workingHourServices";

// SWR Hook for fetching all working hours with optional filters
export const useWorkingHours = (filters?: any) => {
   const key = filters ? ["working-hours", filters] : "working-hours";

   const {
      data: response,
      error,
      mutate,
   } = useSWR(key, () => fetchWorkingHours(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      workingHours: response,
      isLoading: !response && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single working hour entry by ID
export const useWorkingHourById = (workingHourId: number | string | null) => {
   const { data, error, isLoading } = useSWR(
      workingHourId ? `/working-hour/${workingHourId}` : null,
      () => fetchWorkingHourById(workingHourId!),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      workingHour: data,
      isLoading,
      isError: !!error,
   };
};

// Hook for creating a working hour entry
export const useCreateWorkingHour = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (data: any) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createWorkingHour(data);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createWorkingHour: create,
      isCreating,
      error,
   };
};

// Hook for updating a working hour entry
export const useUpdateWorkingHour = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (workingHourId: number | string, data: any) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateWorkingHour(workingHourId, data);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateWorkingHour: update,
      isUpdating,
      error,
   };
};

// Hook for deleting a working hour entry
export const useDeleteWorkingHour = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const remove = async (workingHourId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteWorkingHour(workingHourId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteWorkingHour: remove,
      isDeleting,
      error,
   };
};
