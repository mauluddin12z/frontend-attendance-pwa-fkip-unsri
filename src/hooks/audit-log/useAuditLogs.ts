import { useState } from "react";
import useSWR from "swr";
import {
   fetchAuditLogs,
   fetchAuditLogById,
   createAuditLog,
   updateAuditLog,
   deleteAuditLog,
} from "@/api/auditLogServices";

// Fetch all audit logs
export const useAuditLogs = (filters?: any) => {
   const key = filters ? ["auditLogs", filters] : "auditLogs";

   const { data, error, mutate } = useSWR(key, () => fetchAuditLogs(filters), {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
   });

   return {
      auditLogs: data,
      isLoading: !data && !error,
      isError: !!error,
      mutate,
   };
};

// Fetch audit log by ID
export const useAuditLogById = (auditLogId: number) => {
   const { data, error, isLoading } = useSWR(
      auditLogId ? `/audit-log/${auditLogId}` : null,
      () => fetchAuditLogById(auditLogId),
      {
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
      }
   );

   return {
      auditLog: data,
      isLoading,
      isError: !!error,
   };
};

// Create audit log
export const useCreateAuditLog = () => {
   const [isCreating, setIsCreating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const create = async (logData: FormData) => {
      setIsCreating(true);
      setError(null);
      try {
         const response = await createAuditLog(logData);
         setIsCreating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsCreating(false);
         throw err;
      }
   };

   return {
      createAuditLog: create,
      isCreating,
      error,
   };
};

// Update audit log
export const useUpdateAuditLog = () => {
   const [isUpdating, setIsUpdating] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const update = async (
      auditLogId: number | string,
      updatedData: FormData
   ) => {
      setIsUpdating(true);
      setError(null);
      try {
         const response = await updateAuditLog(auditLogId, updatedData);
         setIsUpdating(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsUpdating(false);
         throw err;
      }
   };

   return {
      updateAuditLog: update,
      isUpdating,
      error,
   };
};

// Delete audit log
export const useDeleteAuditLog = () => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const remove = async (auditLogId: number | string) => {
      setIsDeleting(true);
      setError(null);
      try {
         const response = await deleteAuditLog(auditLogId);
         setIsDeleting(false);
         return response;
      } catch (err: any) {
         setError(err);
         setIsDeleting(false);
         throw err;
      }
   };

   return {
      deleteAuditLog: remove,
      isDeleting,
      error,
   };
};
