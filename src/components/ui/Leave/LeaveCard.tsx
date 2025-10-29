import { LeaveRequest } from "@/types";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import { useState } from "react";
import Modal from "../Modal/Modal";
import LoadingButton from "../Loading/LoadingButton";
import IconDeleteButton from "../IconDeleteButton";

interface LeaveCardProps extends LeaveRequest {
   onDelete?: () => void;
   isDeleting?: boolean;
}

const STATUS_STYLES: Record<
   string,
   { label: string; bg: string; text: string; border: string }
> = {
   "menunggu persetujuan": {
      label: "Menunggu Persetujuan",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
   },
   disetujui: {
      label: "Disetujui",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
   },
   ditolak: {
      label: "Ditolak",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
   },
   dibatalkan: {
      label: "Dibatalkan",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
   },
};

const LeaveCard: React.FC<LeaveCardProps> = ({
   leaveType,
   startDate,
   endDate,
   reason,
   status,
   approvalNotes,
   approver,
   createdAt,
   onDelete,
   isDeleting,
}) => {
   const [showDeleteModal, setShowDeleteModal] = useState(false);

   const statusInfo = (status && STATUS_STYLES[status.toLowerCase()]) || {
      label: status || "Tidak diketahui",
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
   };

   const handleDelete = () => {
      if (onDelete) onDelete();
      setShowDeleteModal(false);
   };

   return (
      <>
         <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
               <div className="text-xs text-gray-500">
                  Diajukan: {formatDateTime(createdAt)}
               </div>
               <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
               >
                  {statusInfo.label}
               </span>
            </div>

            {/* Content */}
            <div className="space-y-1 text-sm text-gray-700">
               <p>
                  <span className="font-semibold text-gray-800">
                     Jenis izin:
                  </span>{" "}
                  {leaveType || "-"}
               </p>
               <p>
                  <span className="font-semibold text-gray-800">
                     Dari tanggal:
                  </span>{" "}
                  {formatDate(startDate)}
               </p>
               <p>
                  <span className="font-semibold text-gray-800">
                     Sampai tanggal:
                  </span>{" "}
                  {formatDate(endDate)}
               </p>
               {reason && (
                  <p>
                     <span className="font-semibold text-gray-800">
                        Alasan:
                     </span>{" "}
                     <span className="italic">{reason}</span>
                  </p>
               )}
               {approvalNotes && (
                  <p>
                     <span className="font-semibold text-gray-800">
                        Catatan Persetujuan:
                     </span>{" "}
                     {approvalNotes}
                  </p>
               )}
               {approver?.fullName && (
                  <p>
                     <span className="font-semibold text-gray-800">
                        Disetujui oleh:
                     </span>{" "}
                     {approver.fullName}
                  </p>
               )}
            </div>

            {/* Delete button (for pending requests) */}
            {status?.toLowerCase() === "menunggu persetujuan" && onDelete && (
               <div className="mt-4">
                  <IconDeleteButton
                     action={() => setShowDeleteModal(true)}
                     isAction={isDeleting!}
                  />
               </div>
            )}
         </div>

         {/* Delete Confirmation Modal */}
         {showDeleteModal && (
            <Modal
               isOpen={showDeleteModal}
               closeModal={() => setShowDeleteModal(false)}
               footer={
                  <div className="flex justify-end gap-3 pt-3">
                     <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
                     >
                        Batal
                     </button>
                     <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition ${
                           isDeleting ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                     >
                        {isDeleting ? (
                           <LoadingButton label="Menghapus..." />
                        ) : (
                           "Hapus"
                        )}
                     </button>
                  </div>
               }
            >
               <div className="p-4 text-gray-700">
                  <p>Apakah Anda yakin ingin menghapus pengajuan izin ini?</p>
               </div>
            </Modal>
         )}
      </>
   );
};

export default LeaveCard;
