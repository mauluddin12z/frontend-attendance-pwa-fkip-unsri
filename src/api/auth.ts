import axios, { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

const API_BASE_URL = process.env.NEXT_PUBLIC_MY_BACKEND_URL as string;

export const refreshAccessToken = async (): Promise<string | null> => {
   try {
      // Make the request to refresh the token in the cookies
      await axios.post(
         `${API_BASE_URL}/auth/refresh-token`,
         {},
         {
            withCredentials: true, // Ensure cookies are sent and received
         }
      );
      return null;
   } catch (error: any) {
      toast.error("Failed to refresh access token", error?.message || error);
      window.location.href = "/login";
      return null;
   }
};

// Login user
export const login = async (username: string, password: string) => {
   try {
      const response = await axios.post(
         `${process.env.NEXT_PUBLIC_MY_BACKEND_URL}/auth/login`,
         { username, password },
         { withCredentials: true }
      );

      return response;
   } catch (error: any) {
      throw handleApiError(error, "Network error or no response received");
   }
};

// Get Session
export const getSession = async () => {
   try {
      const response = await axiosInstance.get(`/auth/session`);
      return response;
   } catch (error) {
      throw handleApiError(error, "Error getting session");
   }
};

// Logout user
export const logout = async (): Promise<void> => {
   try {
      await axiosInstance.post(`/auth/logout`, {});
      window.location.href = "/login";
   } catch (error: any) {
      throw handleApiError(error, "Error logging out");
   }
};
