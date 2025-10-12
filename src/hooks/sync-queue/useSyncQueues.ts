import { useState } from "react";
import useSWR from "swr";
import {
   fetchSyncQueues,
   fetchSyncQueueById,
   createSyncQueue,
   updateSyncQueue,
   deleteSyncQueue,
} from "@/api/syncQueueServices";

// SWR Hook for fetching all sync queues
export const useSyncQueues = (filters?: any) => {
   const key = filters ? ["syncQueues", filters] : "syncQueues";

   const { data, error, mutate } = useSWR(key, () => fetchSyncQueues(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      syncQueues: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a sync queue by ID
export const useSyncQueueById = (syncQueueId: number) => {
   const { data, error, isLoading } = useSWR(
      syncQueueId ? `/sync-queue/${syncQueueId}` : null,
      () => fetchSyncQueueById(syncQueueId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      syncQueue: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook for creating a sync queue
export const useCreateSyncQueue = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (data: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createSyncQueue(data);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createSyncQueue: create,
      isCreating,
      error,
   };
};

// SWR Hook for updating a sync queue
export const useUpdateSyncQueue = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (
      syncQueueId: number | string,
      updatedData: FormData
   ) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateSyncQueue(syncQueueId, updatedData);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateSyncQueue: update,
      isUpdating,
      error,
   };
};

// SWR Hook for deleting a sync queue
export const useDeleteSyncQueue = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const remove = async (syncQueueId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteSyncQueue(syncQueueId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteSyncQueue: remove,
      isDeleting,
      error,
   };
};
