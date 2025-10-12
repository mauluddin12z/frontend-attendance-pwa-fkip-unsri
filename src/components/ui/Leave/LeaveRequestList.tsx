import React from "react";
import LeaveCard from "./LeaveCard";
import { LeaveRequest } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { useDeleteLeaveRequest } from "@/hooks/leave-request";
import toast from "react-hot-toast";

interface Props {
   requests: LeaveRequest[];
   isLoading: boolean;
   showLimit?: number;
   onViewAll?: () => void;
   refetchAll: () => Promise<void>;
}

const LeaveRequestList: React.FC<Props> = ({
   requests,
   isLoading,
   showLimit,
   onViewAll,
   refetchAll,
}) => {
   const { deleteLeaveRequest, isDeleting } = useDeleteLeaveRequest();

   const handleDelete = async (id: number) => {
      const toastId = toast.loading("Menghapus...");
      try {
         await deleteLeaveRequest(id);
         await refetchAll();
         toast.success("Pengajuan berhasil dihapus.", { id: toastId });
      } catch {
         toast.error("Gagal menghapus pengajuan.", { id: toastId });
      }
   };

   const visibleRequests = showLimit ? requests.slice(0, showLimit) : requests;

   return (
      <>
         {isLoading ? (
            <div className="flex justify-center">
               <LoadingSpinner />
            </div>
         ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center text-sm">
               Tidak ada data pengajuan izin.
            </p>
         ) : (
            <div className="space-y-4">
               {visibleRequests.map((request) => (
                  <LeaveCard
                     key={request.id}
                     {...request}
                     onDelete={() => handleDelete(request.id)}
                     isDeleting={isDeleting}
                  />
               ))}

               {showLimit && requests.length > showLimit && onViewAll && (
                  <div className="flex justify-center">
                     <button
                        onClick={onViewAll}
                        className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
                     >
                        Lihat Semua
                     </button>
                  </div>
               )}
            </div>
         )}
      </>
   );
};

export default LeaveRequestList;
