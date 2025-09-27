// hooks/useSettingsGeofences.ts

import { useState } from "react";
import useSWR from "swr";
import {
   fetchSettingsGeofences,
   fetchSettingsGeofenceById,
   createSettingsGeofence,
   updateSettingsGeofence,
   deleteSettingsGeofence,
} from "@/api/settingsGeofenceServices";

// SWR Hook for fetching all settings geofences with optional filters
export const useSettingsGeofences = (filters?: any) => {
   const key = filters ? ["settings-geofences", filters] : "settings-geofences";

   const {
      data: response,
      error,
      mutate,
   } = useSWR(key, () => fetchSettingsGeofences(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      settingsGeofences: response,
      isLoading: !response && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single settings geofence by ID
export const useSettingsGeofenceById = (geofenceId: number | string | null) => {
   const { data, error, isLoading } = useSWR(
      geofenceId ? `/geofence/${geofenceId}` : null,
      () => fetchSettingsGeofenceById(geofenceId!),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      settingsGeofence: data,
      isLoading,
      isError: !!error,
   };
};

// Hook for creating a settings geofence
export const useCreateSettingsGeofence = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (data: any) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createSettingsGeofence(data);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createSettingsGeofence: create,
      isCreating,
      error,
   };
};

// Hook for updating a settings geofence
export const useUpdateSettingsGeofence = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (geofenceId: number | string, data: any) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateSettingsGeofence(geofenceId, data);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateSettingsGeofence: update,
      isUpdating,
      error,
   };
};

// Hook for deleting a settings geofence
export const useDeleteSettingsGeofence = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const remove = async (geofenceId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteSettingsGeofence(geofenceId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteSettingsGeofence: remove,
      isDeleting,
      error,
   };
};
