import { LeaveRequest } from "@/types";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Modal from "../Modal/Modal";
import LoadingButton from "../Loading/LoadingButton";

interface LeaveCardProps extends LeaveRequest {
   onDelete?: () => void;
   isDeleting?: boolean;
}

const statusMap: Record<string, { label: string; color: string }> = {
   "Menunggu persetujuan": {
      label: "Menunggu persetujuan",
      color: "bg-blue-300 border border-blue-400 text-blue-800",
   },
   disetujui: {
      label: "Disetujui",
      color: "bg-green-300 border border-green-400 text-green-800",
   },
   ditolak: {
      label: "Ditolak",
      color: "bg-red-300 border border-red-400 text-red-800",
   },
   dibatalkan: {
      label: "Dibatalkan",
      color: "bg-amber-300 border border-amber-400 text-amber-800",
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
   const statusInfo =
      status && statusMap[status]
         ? statusMap[status]
         : {
              label: status || "unknown",
              color: "bg-gray-100 text-gray-700",
           };

   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const openDeleteModal = () => {
      setDeleteModalOpen(true);
   };

   const closeDeleteModal = () => {
      setDeleteModalOpen(false);
   };

   return (
      <>
         <div className="relative bg-white shadow rounded-md px-4 py-2 border border-gray-200">
            {status === "menunggu persetujuan" && onDelete && (
               <button
                  onClick={openDeleteModal}
                  disabled={isDeleting}
                  title="Hapus"
                  className={`absolute bottom-2 right-2 p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600 transition duration-200 ${
                     isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
               >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
               </button>
            )}

            <div className="flex justify-between items-center mb-2 border-b border-gray-200 py-2">
               <div className="flex gap-2 text-sm text-gray-400">
                  <p>{formatDateTime(createdAt)}</p>
               </div>
               <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
               >
                  {statusInfo.label}
               </span>
            </div>
            <div className="flex gap-2 text-sm text-gray-700"></div>
            <div className="text-sm text-gray-700">
               <p className="font-semibold mb-1">
                  Dari tanggal:{" "}
                  <span className="font-normal">{formatDate(startDate)}</span>
               </p>
            </div>
            <div className="text-sm text-gray-700">
               <p className="font-semibold mb-1">
                  Sampai tanggal:{" "}
                  <span className="font-normal">{formatDate(endDate)}</span>
               </p>
            </div>
            <div className="text-sm text-gray-700">
               <p className="font-semibold mb-1">
                  Izin: <span className="font-normal">{leaveType}</span>
               </p>
            </div>

            <div className="text-sm text-gray-700">
               <p className="font-semibold mb-1">
                  Alasan: <span className="font-normal">{reason}</span>
               </p>
            </div>

            {approvalNotes && (
               <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Catatan Persetujuan:</p>
                  <p>{approvalNotes}</p>
               </div>
            )}
            {approver && (
               <div className="text-sm text-gray-700">
                  {approvalNotes && (
                     <p className="font-semibold mb-1">
                        Catatan Persetujuan:{" "}
                        <span className="font-normal">{approvalNotes}</span>
                     </p>
                  )}
                  {approver?.fullName && (
                     <p className="font-semibold mb-1">
                        Approver:{" "}
                        <span className="font-normal">
                           {approver?.fullName}
                        </span>
                     </p>
                  )}
               </div>
            )}
         </div>
         {deleteModalOpen && (
            <Modal
               isOpen={deleteModalOpen}
               closeModal={closeDeleteModal}
               footer={
                  <div className="flex justify-end space-x-4 pt-2">
                     <button
                        onClick={closeDeleteModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                     >
                        Cancel
                     </button>
                     {onDelete && (
                        <button
                           onClick={() => {
                              onDelete();
                           }}
                           disabled={isDeleting}
                           className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                              isDeleting
                                 ? "opacity-50 cursor-not-allowed"
                                 : "cursor-pointer"
                           }`}
                        >
                           {isDeleting ? (
                              <LoadingButton label="Loading..." />
                           ) : (
                              "Delete"
                           )}
                        </button>
                     )}
                  </div>
               }
            >
               <p className="p-4">Yakin ingin menghapus pengajuan ini?</p>
            </Modal>
         )}
      </>
   );
};

export default LeaveCard;
