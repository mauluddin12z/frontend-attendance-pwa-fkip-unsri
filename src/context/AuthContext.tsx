"use client";
import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import axiosInstance from "@/api/axiosInstance";
import { logout } from "@/api/auth";
import { Session } from "@/types";
import toast from "react-hot-toast";

// Define the context type
interface AuthContextType {
   user: Session | null;
   isLoading: boolean;
   mutate: () => void;
   handleLogout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fetcher function for SWR
const fetchSession = async (): Promise<Session | null> => {
   const { data } = await axiosInstance.get("/auth/session");
   return data?.user || null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const pathname = usePathname();

   // Skip fetching if on login page
   const shouldFetch = pathname !== "/login";

   const {
      data: user,
      error,
      isLoading,
      mutate,
   } = useSWR<Session | null>(
      shouldFetch ? "/auth/session" : null,
      fetchSession
   );

   // Logout handler
   const handleLogout = async () => {
      try {
         const toastId = toast.loading("Logging out...");
         await logout();
         await mutate(null, false);
         toast.success("You are logged out successfully", { id: toastId });
      } catch (error) {
         toast.error(`Error logging out: ${error}`);
      }
   };

   return (
      <AuthContext.Provider
         value={{
            user: user ?? null,
            isLoading,
            mutate,
            handleLogout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
