import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all audit logs
export const fetchAuditLogs = async (filters: any = {}) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/audit-logs", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching audit logs");
   }
};

// Fetch audit log by ID
export const fetchAuditLogById = async (auditLogId: number) => {
   try {
      const response = await axiosInstance.get(`/audit-log/${auditLogId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching audit log by ID");
   }
};

// Create new audit log
export const createAuditLog = async (logData: FormData) => {
   try {
      const response = await axiosInstance.post("/audit-log", logData);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating audit log");
   }
};

// Update existing audit log
export const updateAuditLog = async (
   auditLogId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/audit-log/${auditLogId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating audit log");
   }
};

// Delete audit log
export const deleteAuditLog = async (auditLogId: number | string) => {
   try {
      const response = await axiosInstance.delete(`/audit-log/${auditLogId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting audit log");
   }
};
