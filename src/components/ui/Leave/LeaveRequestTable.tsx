import { LeaveRequest } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import Link from "next/link";
import customMoment from "@/utils/customMoment";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const statusMap: Record<string, { label: string; color: string }> = {
   "menunggu persetujuan": {
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

interface LeaveRequestTableProps {
   leaveRequests: LeaveRequest[];
   leaveRequestLoading: boolean;
   openModal: (
      leaveRequest: LeaveRequest,
      action: "approve" | "reject" | "edit" | "delete"
   ) => void;
   columnVisibility?: {
      id?: boolean;
      leaveUser?: boolean;
      leaveType?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      reason?: boolean;
      status?: boolean;
      approver?: boolean;
      approvalNotes?: boolean;
      action?: boolean;
   };
}

const LeaveRequestTable = ({
   leaveRequests,
   leaveRequestLoading,
   openModal,
   columnVisibility = {},
}: LeaveRequestTableProps) => {
   const defaultVisibility = {
      id: false,
      leaveUser: true,
      leaveType: true,
      startDate: true,
      endDate: true,
      reason: true,
      status: true,
      approver: true,
      approvalNotes: true,
      action: true,
   };

   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   const [activeDropdownId, setActiveDropdownId] = useState<number | null>(
      null
   );

   const toggleDropdown = (rowId: number) => {
      setActiveDropdownId((prev) => (prev === rowId ? null : rowId));
   };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && <th className="px-6 py-3">Id</th>}
               {finalColumnVisibility.leaveUser && (
                  <th className="px-6 py-3">Nama</th>
               )}
               {finalColumnVisibility.leaveType && (
                  <th className="px-6 py-3">Tipe Izin</th>
               )}
               {finalColumnVisibility.startDate && (
                  <th className="px-6 py-3">Dari tanggal</th>
               )}
               {finalColumnVisibility.endDate && (
                  <th className="px-6 py-3">Sampai tanggal</th>
               )}
               {finalColumnVisibility.reason && (
                  <th className="px-6 py-3">Alasan</th>
               )}
               {finalColumnVisibility.status && (
                  <th className="px-6 py-3">Status</th>
               )}
               {finalColumnVisibility.approver && (
                  <th className="px-6 py-3">Disetujui oleh</th>
               )}
               {finalColumnVisibility.approvalNotes && (
                  <th className="px-6 py-3">Catatan</th>
               )}
               {finalColumnVisibility.action && (
                  <th className="px-6 py-3 text-center">Aksi</th>
               )}
            </tr>
         </thead>
         <tbody>
            {leaveRequestLoading ? (
               <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : leaveRequests.length === 0 ? (
               <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                     Tidak ada data yang ditemukan
                  </td>
               </tr>
            ) : (
               leaveRequests?.map((leaveRequest) => {
                  const statusKey =
                     leaveRequest.status?.toLowerCase?.() || "unknown";
                  const statusInfo = statusMap[statusKey] || {
                     label: leaveRequest.status,
                     color: "bg-gray-300 border text-gray-800",
                  };

                  return (
                     <tr
                        key={leaveRequest.id}
                        className="bg-white border-gray-200 border-b"
                     >
                        {finalColumnVisibility.id && (
                           <td className="px-6 py-4">
                              {leaveRequest.id || "---"}
                           </td>
                        )}
                        {finalColumnVisibility.leaveUser && (
                           <td className="px-6 py-4">
                              <Link
                                 href={`/administrator/izin/${leaveRequest.leaveUser?.nip}`}
                              >
                                 <span className="hover:underline font-semibold">
                                    {leaveRequest.leaveUser?.fullName || "---"}
                                 </span>
                              </Link>
                           </td>
                        )}
                        {finalColumnVisibility.leaveType && (
                           <td className="px-6 py-4">
                              {leaveRequest.leaveType || "---"}
                           </td>
                        )}
                        {finalColumnVisibility.startDate && (
                           <td className="px-6 py-4">
                              {leaveRequest.startDate
                                 ? customMoment(leaveRequest.startDate).format(
                                      "DD-MM-YYYY"
                                   )
                                 : "---"}
                           </td>
                        )}
                        {finalColumnVisibility.endDate && (
                           <td className="px-6 py-4">
                              {leaveRequest.endDate
                                 ? customMoment(leaveRequest.endDate).format(
                                      "DD-MM-YYYY"
                                   )
                                 : "---"}
                           </td>
                        )}
                        {finalColumnVisibility.reason && (
                           <td className="px-6 py-4">
                              {leaveRequest.reason || "---"}
                           </td>
                        )}

                        {finalColumnVisibility.status && (
                           <td className="px-6 py-4 relative">
                              {leaveRequest.status ===
                              "menunggu persetujuan" ? (
                                 <div className="inline-block text-left">
                                    <button
                                       onClick={() =>
                                          toggleDropdown(leaveRequest.id)
                                       }
                                       className={`px-3 py-1 rounded-full text-xs font-semibold text-nowrap focus:outline-none ${statusInfo.color} cursor-pointer`}
                                    >
                                       <span className="flex gap-x-1 items-center">
                                          {leaveRequest.status}
                                          <FontAwesomeIcon
                                             icon={
                                                activeDropdownId
                                                   ? faAngleDown
                                                   : faAngleRight
                                             }
                                          />
                                       </span>
                                    </button>

                                    {activeDropdownId === leaveRequest.id && (
                                       <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-300 rounded shadow text-sm text-gray-700">
                                          <button
                                             onClick={() => {
                                                openModal(
                                                   leaveRequest,
                                                   "approve"
                                                );
                                                setActiveDropdownId(null);
                                             }}
                                             className="block w-full px-4 py-2 text-left hover:bg-green-100 text-green-700 cursor-pointer"
                                          >
                                             Setujui
                                          </button>
                                          <button
                                             onClick={() => {
                                                openModal(
                                                   leaveRequest,
                                                   "reject"
                                                );
                                                setActiveDropdownId(null);
                                             }}
                                             className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-700 cursor-pointer"
                                          >
                                             Tolak
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              ) : (
                                 <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold text-nowrap ${statusInfo.color}`}
                                 >
                                    {statusInfo.label}
                                 </span>
                              )}
                           </td>
                        )}

                        {finalColumnVisibility.approver && (
                           <td className="px-6 py-4">
                              {leaveRequest.approver?.fullName || "---"}
                           </td>
                        )}
                        {finalColumnVisibility.approvalNotes && (
                           <td className="px-6 py-4">
                              {leaveRequest.approvalNotes || "---"}
                           </td>
                        )}
                        {finalColumnVisibility.action && (
                           <td className="px-6 py-4 text-center">
                              <div className="flex justify-center items-center gap-2">
                                 <button
                                    onClick={() =>
                                       openModal(leaveRequest, "edit")
                                    }
                                    className="font-medium text-blue-600 hover:underline cursor-pointer"
                                 >
                                    Edit
                                 </button>
                                 <button
                                    onClick={() =>
                                       openModal(leaveRequest, "delete")
                                    }
                                    className="font-medium text-red-600 hover:underline cursor-pointer"
                                 >
                                    Delete
                                 </button>
                              </div>
                           </td>
                        )}
                     </tr>
                  );
               })
            )}
         </tbody>
      </table>
   );
};

export default LeaveRequestTable;
