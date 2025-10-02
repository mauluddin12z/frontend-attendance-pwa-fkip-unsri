// services/holidayService.ts

import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";
import { buildQueryParams } from "@/utils/apiUtils";

// Fetch all holidays with optional filters
export const fetchHolidays = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/holidays", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching holidays");
   }
};

// Fetch a single holiday by ID
export const fetchHolidayById = async (id: number | string) => {
   try {
      const response = await axiosInstance.get(`/holiday/${id}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, `Error fetching holiday ${id}`);
   }
};

// Create a new holiday
export const createHoliday = async (data: any) => {
   try {
      const response = await axiosInstance.post("/holiday", data);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating holiday");
   }
};

// Update an existing holiday
export const updateHoliday = async (id: number | string, data: any) => {
   try {
      const response = await axiosInstance.patch(`/holiday/${id}`, data);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, `Error updating holiday ${id}`);
   }
};

// Delete a holiday by ID
export const deleteHoliday = async (id: number | string) => {
   try {
      const response = await axiosInstance.delete(`/holiday/${id}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, `Error deleting holiday ${id}`);
   }
};
