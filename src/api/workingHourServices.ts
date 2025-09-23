// services/workingHoursService.ts

import axiosInstance from "./axiosInstance";
import { buildQueryParams } from "@/utils/apiUtils";

// Fetch all working hours with optional filters
export const fetchWorkingHours = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/working-hours", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error fetching working hours"
      );
   }
};

// Fetch a single working hour entry by ID
export const fetchWorkingHourById = async (workingHourId: number | string) => {
   try {
      const response = await axiosInstance.get(
         `/working-hour/${workingHourId}`
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            `Error fetching working hour ${workingHourId}`
      );
   }
};

// Create a new working hour entry
export const createWorkingHour = async (data: any) => {
   try {
      const response = await axiosInstance.post("/working-hour", data);
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message || "Error creating working hour"
      );
   }
};

// Update an existing working hour entry
export const updateWorkingHour = async (
   workingHourId: number | string,
   data: any
) => {
   try {
      const response = await axiosInstance.patch(
         `/working-hour/${workingHourId}`,
         data
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            `Error updating working hour ${workingHourId}`
      );
   }
};

// Delete a working hour entry by ID
export const deleteWorkingHour = async (workingHourId: number | string) => {
   try {
      const response = await axiosInstance.delete(
         `/working-hour/${workingHourId}`
      );
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            `Error deleting working hour ${workingHourId}`
      );
   }
};
