import { useState } from "react";
import useSWR from "swr";
import {
   fetchUserById,
   fetchUsers,
   updateUser,
   deleteUser,
   createUser,
   updateUserProfile,
} from "@/api/userServices";

// SWR Hook for fetching all users with optional filters
export const useUsers = (filters?: any) => {
   const key = filters ? ["users", filters] : "users";

   const {
      data: response,
      error,
      mutate,
   } = useSWR(key, () => fetchUsers(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      users: response,
      isLoading: !response && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single user by their ID
export const useUserById = (userId: number) => {
   const { data, error, isLoading } = useSWR(
      userId ? `/user/${userId}` : null,
      () => fetchUserById(userId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      user: data,
      isLoading,
      isError: !!error,
   };
};


// Hook for creating a new user
export const useCreateUser = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (userData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createUser(userData);
         setIsCreating(false);
         return response; // Return the created user data
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createUser: create,
      isCreating,
      error,
   };
};

// Hook for updating an existing user
export const useUpdateUser = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (userId: number | string, updatedData: FormData) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateUser(userId, updatedData);
         setIsUpdating(false);
         return response; // Return the updated user data
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateUser: update,
      isUpdating,
      error,
   };
};
// Hook for updating an existing user
export const useUpdateUserProfile = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (userId: number | string, updatedData: FormData) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateUserProfile(userId, updatedData);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateUser: update,
      isUpdating,
      error,
   };
};

// Hook for deleting a user
export const useDeleteUser = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const deleteRecord = async (userId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteUser(userId);
         setIsDeleting(false);
         return response; // Return confirmation message
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteUser: deleteRecord,
      isDeleting,
      error,
   };
};
