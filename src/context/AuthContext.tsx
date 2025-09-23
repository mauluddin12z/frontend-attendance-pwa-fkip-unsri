"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axiosInstance from "@/api/axiosInstance";
import { logout } from "@/api/auth";
import { Session, User } from "@/types";
import toast from "react-hot-toast";

// Define the context type
interface AuthContextType {
   user: Session | null;
   isLoading: boolean;
   handleLogout: () => void;
}

// Create the context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<Session | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const pathname = usePathname(); // Current page path

   useEffect(() => {
      // If we are on the login page, skip fetching user session
      if (pathname === "/login") {
         setIsLoading(false);
         return;
      }

      // Function to fetch user session data
      const fetchUser = async () => {
         try {
            const { data } = await axiosInstance.get("/auth/session");
            if (data && data.user) {
               setUser(data.user); // Set user if session exists
            } else {
               setUser(null); // No user session, clear user data
            }
         } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUser(null); // On error, clear user data
         } finally {
            setIsLoading(false); // Once the fetch completes, stop loading
         }
      };

      fetchUser();
   }, [pathname]); // Run this effect only when `pathname` changes

   // Handle logout
   const handleLogout = async () => {
      try {
         const toastId = toast.loading("Logging out...");
         setIsLoading(true);
         await logout();
         setUser(null);
         toast.success("You are logged out successfully", { id: toastId });
         setIsLoading(false);
      } catch (error) {
         toast.error(`Error logging out: ${error}`);
      }
   };

   // Provide the context value to the components
   return (
      <AuthContext.Provider value={{ user, isLoading, handleLogout }}>
         {children}
      </AuthContext.Provider>
   );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
   const context = useContext(AuthContext);

   // Ensure the context is used correctly (within the provider)
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }

   return context;
};
