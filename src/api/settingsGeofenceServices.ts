// services/settingsGeofenceService.ts

import { handleApiError } from "@/utils/handleApiError";
import axiosInstance from "./axiosInstance";
import { buildQueryParams } from "@/utils/apiUtils";

// Fetch all geofences with optional filters
export const fetchSettingsGeofences = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/geofences", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching geofences");
   }
};

// Fetch a single geofence by ID
export const fetchSettingsGeofenceById = async (
   geofenceId: number | string
) => {
   try {
      const response = await axiosInstance.get(`/geofence/${geofenceId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, `Error fetching geofence ${geofenceId}`);
   }
};

// Create a new geofence
export const createSettingsGeofence = async (data: any) => {
   try {
      const response = await axiosInstance.post("/geofence", data);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating geofence");
   }
};

// Update an existing geofence
export const updateSettingsGeofence = async (
   geofenceId: number | string,
   data: any
) => {
   try {
      const response = await axiosInstance.patch(
         `/geofence/${geofenceId}`,
         data
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, `Error updating geofence ${geofenceId}`);
   }
};

// Delete a geofence by ID
export const deleteSettingsGeofence = async (geofenceId: number | string) => {
   try {
      const response = await axiosInstance.delete(`/geofence/${geofenceId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, `Error deleting geofence ${geofenceId}`);
   }
};
