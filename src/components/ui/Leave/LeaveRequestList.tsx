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
      const toastId = toast.loading("Menghapus pengajuan...");
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
      <div className="mt-4">
         {isLoading ? (
            <div className="flex justify-center py-10">
               <LoadingSpinner />
            </div>
         ) : requests.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm animate-fadeIn">
               <p className="mb-2">📭 Tidak ada pengajuan izin.</p>
               <p>
                  Klik tombol <strong>Buat Pengajuan</strong> untuk menambah
                  data.
               </p>
            </div>
         ) : (
            <>
               <div className="space-y-5 animate-fadeIn">
                  {visibleRequests.map((request) => (
                     <LeaveCard
                        key={request.id}
                        {...request}
                        onDelete={() => handleDelete(request.id)}
                        isDeleting={isDeleting}
                     />
                  ))}
               </div>

               {showLimit && requests.length > showLimit && onViewAll && (
                  <div className="flex justify-center mt-8">
                     <button
                        onClick={onViewAll}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow-md transition-all"
                     >
                        Lihat Semua
                     </button>
                  </div>
               )}
            </>
         )}
      </div>
   );
};

export default LeaveRequestList;
