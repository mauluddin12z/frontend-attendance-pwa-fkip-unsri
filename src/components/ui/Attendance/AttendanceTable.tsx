import { Attendance } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import { attendanceStatusStyle } from "@/utils/attendanceStatusStyle";
import Link from "next/link";

interface AttendanceTableProps {
   attendances: any;
   attendanceLoading: boolean;
   openModal: (
      attendance: Attendance,
      action: "detail" | "edit" | "delete"
   ) => void;
   columnVisibility?: {
      id?: boolean;
      user?: boolean;
      date?: boolean;
      status?: boolean;
      notes?: boolean;
      details?: boolean;
      action?: boolean;
   };
}

const AttendanceTable = ({
   attendances,
   attendanceLoading,
   openModal,
   columnVisibility = {},
}: AttendanceTableProps) => {
   // Default column visibility configuration
   const defaultVisibility = {
      id: true,
      user: true,
      date: true,
      status: true,
      notes: true,
      details: true,
      action: true,
   };

   // Merge default visibility with the passed prop to control visibility
   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   const getStatusStyle = (status: string): string => {
      const isValidStatus = (
         status: string
      ): status is keyof typeof attendanceStatusStyle =>
         status in attendanceStatusStyle;

      return isValidStatus(status)
         ? `${attendanceStatusStyle[status].borderColor} ${attendanceStatusStyle[status].bgColor}`
         : `${attendanceStatusStyle.Lainnya.borderColor} ${attendanceStatusStyle.Lainnya.bgColor}`;
   };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && (
                  <th scope="col" className="px-6 py-3">
                     Id
                  </th>
               )}
               {finalColumnVisibility.user && (
                  <th scope="col" className="px-6 py-3">
                     User
                  </th>
               )}
               {finalColumnVisibility.date && (
                  <th scope="col" className="px-6 py-3">
                     Tanggal
                  </th>
               )}
               {finalColumnVisibility.status && (
                  <th scope="col" className="px-6 py-3">
                     Status Absensi
                  </th>
               )}
               {finalColumnVisibility.notes && (
                  <th scope="col" className="px-6 py-3">
                     Catatan
                  </th>
               )}
               {finalColumnVisibility.details && (
                  <th scope="col" className="px-6 py-3">
                     Details
                  </th>
               )}
               {finalColumnVisibility.action && (
                  <th scope="col" className="px-6 py-3 text-center">
                     Aksi
                  </th>
               )}
            </tr>
         </thead>
         <tbody>
            {attendanceLoading ? (
               <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : attendances?.length === 0 ? (
               <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                     Tidak ada data yang ditemukan
                  </td>
               </tr>
            ) : (
               attendances?.map((attendance: Attendance) => (
                  <tr
                     key={attendance.id}
                     className="bg-white border-gray-200 border-b"
                  >
                     {finalColumnVisibility.id && (
                        <td className="px-6 py-4">{attendance.id || "---"}</td>
                     )}
                     {finalColumnVisibility.user && (
                        <td className="px-6 py-4">
                           <Link
                              href={`/administrator/absensi/${attendance.user?.nip}`}
                           >
                              <span className="hover:underline font-semibold">
                                 {attendance.user?.fullName || "---"}
                              </span>
                           </Link>
                        </td>
                     )}
                     {finalColumnVisibility.date && (
                        <td className="px-6 py-4">
                           {attendance.date || "---"}
                        </td>
                     )}
                     {finalColumnVisibility.status && (
                        <td className="px-6 py-4">
                           {attendance.attendanceStatus?.name ? (
                              <span
                                 className={`${getStatusStyle(
                                    attendance.attendanceStatus?.name
                                 )} lowercase px-4 py-2 rounded-full text-xs font-semibold border text-nowrap`}
                              >
                                 {attendance.attendanceStatus?.name}
                              </span>
                           ) : (
                              "---"
                           )}
                        </td>
                     )}
                     {finalColumnVisibility.notes && (
                        <td className="px-6 py-4">
                           {attendance.notes || "---"}
                        </td>
                     )}
                     {finalColumnVisibility.details && (
                        <td className="px-6 py-4">
                           <button
                              onClick={() => openModal(attendance, "detail")}
                              className="hover:underline cursor-pointer"
                           >
                              view details
                           </button>
                        </td>
                     )}
                     {finalColumnVisibility.action && (
                        <td className="px-6 py-4 text-center">
                           <div className="flex justify-center items-center gap-2">
                              <button
                                 onClick={() => openModal(attendance, "edit")}
                                 className="font-medium text-blue-600 hover:underline cursor-pointer"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => openModal(attendance, "delete")}
                                 className="font-medium text-red-600 hover:underline cursor-pointer"
                              >
                                 Delete
                              </button>
                           </div>
                        </td>
                     )}
                  </tr>
               ))
            )}
         </tbody>
      </table>
   );
};

export default AttendanceTable;
