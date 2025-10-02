import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetch all roles (Admin only)
export const fetchRoles = async (filters: any) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get("/roles", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching roles");
   }
};

// Fetch role by ID
export const fetchRoleById = async (roleId: number) => {
   try {
      const response = await axiosInstance.get(`/role/${roleId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching role by ID");
   }
};

// Create a new role
export const createRole = async (roleData: FormData) => {
   try {
      const response = await axiosInstance.post("/role", roleData);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating role");
   }
};

// Update an existing role
export const updateRole = async (
   roleId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/role/${roleId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating role");
   }
};

// Delete a role
export const deleteRole = async (roleId: number | string) => {
   try {
      const response = await axiosInstance.delete(`/role/${roleId}`);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error deleting role");
   }
};
