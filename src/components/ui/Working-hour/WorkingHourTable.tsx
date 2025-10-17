import { WorkingHour } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import customMoment from "@/utils/customMoment";

interface WorkingHourTabProps {
   workingHours: WorkingHour[];
   workingHourLoading: boolean;
   openModal: (workingHour: WorkingHour, action: "edit" | "delete") => void;
   columnVisibility?: {
      id?: boolean;
      dayOfWeek?: boolean;
      startTime?: boolean;
      endTime?: boolean;
      gracePeriodMinutes?: boolean;
      isActive?: boolean;
      action?: boolean;
   };
}

const WorkingHourTable = ({
   workingHours,
   workingHourLoading,
   openModal,
   columnVisibility = {},
}: WorkingHourTabProps) => {
   const defaultVisibility = {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      gracePeriodMinutes: true,
      isActive: true,
      action: true,
   };

   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && <th className="px-6 py-3">ID</th>}
               {finalColumnVisibility.dayOfWeek && (
                  <th className="px-6 py-3">Hari</th>
               )}
               {finalColumnVisibility.startTime && (
                  <th className="px-6 py-3">Waktu Mulai</th>
               )}
               {finalColumnVisibility.endTime && (
                  <th className="px-6 py-3">Waktu Selesai</th>
               )}
               {finalColumnVisibility.gracePeriodMinutes && (
                  <th className="px-6 py-3">Masa Tenggang (Menit)</th>
               )}
               {finalColumnVisibility.isActive && (
                  <th className="px-6 py-3">Aktif</th>
               )}
               {finalColumnVisibility.action && (
                  <th className="px-6 py-3 text-center">Aksi</th>
               )}
            </tr>
         </thead>
         <tbody>
            {workingHourLoading ? (
               <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : !workingHours ? (
               <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                     Tidak ada data jam kerja
                  </td>
               </tr>
            ) : (
               workingHours.map((workingHour: WorkingHour) => (
                  <tr
                     key={workingHour.id}
                     className="bg-white border-b border-gray-200"
                  >
                     {finalColumnVisibility.id && (
                        <td className="px-6 py-4">{workingHour.id}</td>
                     )}
                     {finalColumnVisibility.dayOfWeek && (
                        <td className="px-6 py-4">
                           {customMoment()
                              .weekday(parseInt(workingHour.dayOfWeek))
                              .format("dddd")}
                        </td>
                     )}
                     {finalColumnVisibility.startTime && (
                        <td className="px-6 py-4">{workingHour.startTime}</td>
                     )}
                     {finalColumnVisibility.endTime && (
                        <td className="px-6 py-4">{workingHour.endTime}</td>
                     )}
                     {finalColumnVisibility.gracePeriodMinutes && (
                        <td className="px-6 py-4">
                           {workingHour.gracePeriodMinutes}
                        </td>
                     )}
                     {finalColumnVisibility.isActive && (
                        <td className="px-6 py-4">
                           {workingHour.isActive ? "Ya" : "Tidak"}
                        </td>
                     )}
                     <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                           <button
                              onClick={() => openModal(workingHour, "edit")}
                              className="font-medium text-blue-600 hover:underline cursor-pointer"
                           >
                              Edit
                           </button>
                           <button
                              onClick={() => openModal(workingHour, "delete")}
                              className="font-medium text-red-600 hover:underline cursor-pointer"
                           >
                              Delete
                           </button>
                        </div>
                     </td>
                  </tr>
               ))
            )}
         </tbody>
      </table>
   );
};

export default WorkingHourTable;
