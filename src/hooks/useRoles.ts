import { useState } from "react";
import useSWR from "swr";
import {
   fetchRoles,
   fetchRoleById,
   createRole,
   updateRole,
   deleteRole,
} from "@/api/roleServices";

// SWR Hook for fetching all roles with optional filters
export const useRoles = (filters?: any) => {
   const key = filters ? ["roles", filters] : "roles";

   const { data, error, mutate } = useSWR(key, () => fetchRoles(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      roles: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// SWR Hook for fetching a single role by its ID
export const useRoleById = (roleId: number) => {
   const { data, error, isLoading } = useSWR(
      roleId ? `/role/${roleId}` : null,
      () => fetchRoleById(roleId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      role: data,
      isLoading,
      isError: !!error,
   };
};

// SWR Hook for creating a new role
export const useCreateRole = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (roleData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createRole(roleData);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createRole: create,
      isCreating,
      error,
   };
};

// SWR Hook for updating a role
export const useUpdateRole = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (roleId: number | string, updatedData: FormData) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateRole(roleId, updatedData);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateRole: update,
      isUpdating,
      error,
   };
};

// SWR Hook for deleting a role
export const useDeleteRole = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const deleteRecord = async (roleId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteRole(roleId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteRole: deleteRecord,
      isDeleting,
      error,
   };
};
