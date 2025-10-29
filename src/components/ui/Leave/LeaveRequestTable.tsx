import { LeaveRequest } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import Link from "next/link";
import customMoment from "@/utils/customMoment";

const statusMap: Record<string, { label: string; color: string }> = {
   "menunggu persetujuan": {
      label: "Menunggu persetujuan",
      color: "bg-gray-50 border border-gray-200 text-gray-700",
   },
   disetujui: {
      label: "Disetujui",
      color: "bg-green-50 border border-green-200 text-green-700",
   },
   ditolak: {
      label: "Ditolak",
      color: "bg-red-50 border border-red-200 text-red-700",
   },
   dibatalkan: {
      label: "Dibatalkan",
      color: "bg-amber-50 border border-amber-200 text-amber-700",
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
                              <div className="flex flex-col w-fit items-center">
                                 <span className={`px-3 w-fit py-1 rounded-full text-xs font-medium text-nowrap focus:outline-none ${statusInfo.color}`}>
                                    {leaveRequest.status || "---"}
                                 </span>
                                 {leaveRequest.status ===
                                    "menunggu persetujuan" && (
                                    <div className="flex gap-x-2 mt-2">
                                       <div
                                          onClick={() =>
                                             openModal(leaveRequest, "approve")
                                          }
                                          className="text-green-400 text-xs hover:underline cursor-pointer border border-green-400 px-2.5 py-0.5"
                                       >
                                          setujui
                                       </div>
                                       <div
                                          onClick={() =>
                                             openModal(leaveRequest, "reject")
                                          }
                                          className="text-red-400 text-xs hover:underline cursor-pointer border border-red-400 px-2.5 py-0.5"
                                       >
                                          tolak
                                       </div>
                                    </div>
                                 )}
                              </div>
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
