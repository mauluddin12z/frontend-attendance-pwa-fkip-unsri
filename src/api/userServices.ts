import { buildQueryParams } from "@/utils/apiUtils";
import axiosInstance from "./axiosInstance";

// Fetches all users with optional filters
export const fetchUsers = async (filters: any) => {
   const queryParams = buildQueryParams(filters);

   try {
      const response = await axiosInstance.get("/users", {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error fetching users");
   }
};

// Fetch a single user by their ID
export const fetchUserById = async (userId: number) => {
   const response = await axiosInstance.get(`/user/${userId}`);
   return response.data;
};

// Fetch the attendances for a user by their ID
export const fetchUserAttendances = async (userId: number, filters: any) => {
   const queryParams = buildQueryParams(filters);
   try {
      const response = await axiosInstance.get(`/user/${userId}/attendances`, {
         params: queryParams,
      });
      return response.data;
   } catch (error: any) {
      throw new Error(
         error?.response?.data?.message ||
            `Error fetching attendances for user ${userId}`
      );
   }
};

// Update user data
export const createUser = async (userData: FormData) => {
   try {
      const response = await axiosInstance.post("/user", userData);
      return response.data;
   } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Error creating user");
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
      throw new Error(error?.response?.data?.message || "Error updating user");
   }
};

// Delete a user by their ID

export const deleteUser = async (userId: number | string) => {
   const response = await axiosInstance.delete(`/user/${userId}`);
   return response.data;
};
