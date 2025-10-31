import { LeaveRequest } from "@/types";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import { useState } from "react";
import Modal from "../Modal/Modal";
import LoadingButton from "../Loading/LoadingButton";
import IconDeleteButton from "../IconDeleteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faClock,
   faCheckCircle,
   faTimesCircle,
   faBan,
} from "@fortawesome/free-solid-svg-icons";

interface LeaveCardProps extends LeaveRequest {
   onDelete?: () => void;
   isDeleting?: boolean;
}

const STATUS_STYLES: Record<
   string,
   { label: string; bg: string; text: string; icon: any }
> = {
   "menunggu persetujuan": {
      label: "Menunggu Persetujuan",
      bg: "bg-blue-50 text-blue-700",
      text: "text-blue-700",
      icon: faClock,
   },
   disetujui: {
      label: "Disetujui",
      bg: "bg-green-50 text-green-700",
      text: "text-green-700",
      icon: faCheckCircle,
   },
   ditolak: {
      label: "Ditolak",
      bg: "bg-red-50 text-red-700",
      text: "text-red-700",
      icon: faTimesCircle,
   },
   dibatalkan: {
      label: "Dibatalkan",
      bg: "bg-yellow-50 text-yellow-700",
      text: "text-yellow-700",
      icon: faBan,
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
   const statusKey = status?.toLowerCase() ?? "unknown";
   const statusInfo =
      STATUS_STYLES[statusKey] || STATUS_STYLES["menunggu persetujuan"];

   return (
      <>
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
               <p className="text-xs text-gray-500">
                  {formatDateTime(createdAt)}
               </p>
               <span
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full ${statusInfo.bg}`}
               >
                  <FontAwesomeIcon icon={statusInfo.icon} />
                  {statusInfo.label}
               </span>
            </div>

            {/* Body */}
            <div className="space-y-1 text-sm text-gray-700">
               <p>
                  <span className="font-semibold">Jenis izin:</span> {leaveType}
               </p>
               <p>
                  <span className="font-semibold">Dari:</span>{" "}
                  {formatDate(startDate)} &nbsp;—&nbsp;
                  <span className="font-semibold">Sampai:</span>{" "}
                  {formatDate(endDate)}
               </p>
               {reason && (
                  <p>
                     <span className="font-semibold">Alasan:</span>{" "}
                     <span className="italic">{reason}</span>
                  </p>
               )}
               {approvalNotes && (
                  <p>
                     <span className="font-semibold">Catatan:</span>{" "}
                     {approvalNotes}
                  </p>
               )}
               {approver?.fullName && (
                  <p>
                     <span className="font-semibold">Disetujui oleh:</span>{" "}
                     {approver.fullName}
                  </p>
               )}
            </div>

            {statusKey === "menunggu persetujuan" && onDelete && (
               <div className="mt-4">
                  <IconDeleteButton
                     action={() => setShowDeleteModal(true)}
                     isAction={isDeleting!}
                  />
               </div>
            )}
         </div>

         {/* Modal */}
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
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-60"
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
