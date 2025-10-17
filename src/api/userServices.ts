import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/handleApiError";

// Fetches all users with optional filters
export const fetchUsers = async (filters: any) => {
   const queryParams = buildQueryParams(filters);

   try {
      const response = await axiosInstance.get("/users", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error fetching users");
   }
};

// Fetch a single user by their ID
export const fetchUserById = async (userId: number) => {
   try {
      const response = await axiosInstance.get(`/user/${userId}`);
      return response.data;
   } catch (error) {
      throw handleApiError(error, `Error fetching for user ${userId}`);
   }
};


// Update user data
export const createUser = async (userData: FormData) => {
   try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error creating user");
   }
};

export const updateUser = async (
   userId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/user/${userId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating user");
   }
};

export const updateUserProfile = async (
   userId: number | string,
   updatedData: FormData
) => {
   try {
      const response = await axiosInstance.patch(
         `/update-profile/${userId}`,
         updatedData
      );
      return response.data;
   } catch (error: any) {
      throw handleApiError(error, "Error updating user");
   }
};

// Delete a user by their ID

export const deleteUser = async (userId: number | string) => {
   try {
      const response = await axiosInstance.delete(`/user/${userId}`);
      return response.data;
   } catch (error) {
      throw handleApiError(error, "Error deleting user");
   }
};
