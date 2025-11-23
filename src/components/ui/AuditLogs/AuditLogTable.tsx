import { AuditLog } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import customMoment from "@/utils/customMoment";
import Link from "next/link";

interface AuditLogTableProps {
   auditLogs: AuditLog[];
   auditLogLoading: boolean;
   openModal: (
      auditLog: AuditLog,
      action: "detail" | "edit" | "delete"
   ) => void;
   columnVisibility?: {
      id?: boolean;
      user?: boolean;
      action?: boolean;
      details?: boolean;
      createdAt?: boolean;
   };
}

const AuditLogTable = ({
   auditLogs,
   auditLogLoading,
   openModal,
   columnVisibility = {},
}: AuditLogTableProps) => {
   const defaultVisibility = {
      id: true,
      user: true,
      action: true,
      details: true,
      createdAt: true,
   };

   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && <th className="px-6 py-3">ID</th>}
               {finalColumnVisibility.user && (
                  <th className="px-6 py-3">User</th>
               )}
               {finalColumnVisibility.action && (
                  <th className="px-6 py-3">Aksi</th>
               )}
               {finalColumnVisibility.details && (
                  <th className="px-6 py-3">Detail</th>
               )}
               {finalColumnVisibility.createdAt && (
                  <th className="px-6 py-3">Waktu</th>
               )}
            </tr>
         </thead>
         <tbody>
            {auditLogLoading ? (
               <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : !auditLogs || auditLogs.length === 0 ? (
               <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                     Tidak ada data audit log
                  </td>
               </tr>
            ) : (
               auditLogs.map((log) => (
                  <tr
                     key={log.id}
                     className="bg-white border-b border-gray-200"
                  >
                     {finalColumnVisibility.id && (
                        <td className="px-6 py-4">{log.id}</td>
                     )}
                     {finalColumnVisibility.user && (
                        <td className="px-6 py-4">
                           {log.user ? (
                              <Link
                                 href={`/administrator/logs/${log.user?.nip}`}
                              >
                                 <span className="hover:underline font-semibold">
                                    {log.user?.fullName}
                                 </span>
                              </Link>
                           ) : (
                              <p>---</p>
                           )}
                        </td>
                     )}
                     {finalColumnVisibility.action && (
                        <td className="px-6 py-4">{log.action}</td>
                     )}
                     {finalColumnVisibility.details && (
                        <td className="px-6 py-4">
                           <button
                              onClick={() => openModal(log, "detail")}
                              className="hover:underline cursor-pointer"
                           >
                              view details
                           </button>
                        </td>
                     )}
                     {finalColumnVisibility.createdAt && (
                        <td className="px-6 py-4">
                           {customMoment(log.createdAt).format(
                              "DD MMM YYYY, HH:mm"
                           )}
                        </td>
                     )}
                  </tr>
               ))
            )}
         </tbody>
      </table>
   );
};

export default AuditLogTable;
