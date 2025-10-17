import { Holiday } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";
import customMoment from "@/utils/customMoment";

interface HolidayTableProps {
   holidays: Holiday[];
   holidayLoading: boolean;
   openModal: (holiday: Holiday, action: "edit" | "delete") => void;
   columnVisibility?: {
      id?: boolean;
      name?: boolean;
      date?: boolean;
      description?: boolean;
      action?: boolean;
   };
}

const HolidayTable = ({
   holidays,
   holidayLoading,
   openModal,
   columnVisibility = {},
}: HolidayTableProps) => {
   const defaultVisibility = {
      id: true,
      name: true,
      date: true,
      description: true,
      action: true,
   };

   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && <th className="px-6 py-3">ID</th>}
               {finalColumnVisibility.name && (
                  <th className="px-6 py-3">Nama Liburan</th>
               )}
               {finalColumnVisibility.date && (
                  <th className="px-6 py-3">Tanggal</th>
               )}
               {finalColumnVisibility.description && (
                  <th className="px-6 py-3">Deskripsi</th>
               )}
               {finalColumnVisibility.action && (
                  <th className="px-6 py-3 text-center">Aksi</th>
               )}
            </tr>
         </thead>
         <tbody>
            {holidayLoading ? (
               <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : !holidays || holidays.length === 0 ? (
               <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                     Tidak ada data liburan
                  </td>
               </tr>
            ) : (
               holidays.map((holiday: Holiday) => (
                  <tr
                     key={holiday.id}
                     className="bg-white border-b border-gray-200"
                  >
                     {finalColumnVisibility.id && (
                        <td className="px-6 py-4">{holiday.id}</td>
                     )}
                     {finalColumnVisibility.name && (
                        <td className="px-6 py-4">{holiday.name}</td>
                     )}
                     {finalColumnVisibility.date && (
                        <td className="px-6 py-4">
                           {customMoment(holiday.date).format("DD MMMM YYYY")}
                        </td>
                     )}
                     {finalColumnVisibility.description && (
                        <td className="px-6 py-4">
                           {holiday.description || "-"}
                        </td>
                     )}
                     {finalColumnVisibility.action && (
                        <td className="px-6 py-4 text-center">
                           <div className="flex justify-center items-center gap-2">
                              <button
                                 onClick={() => openModal(holiday, "edit")}
                                 className="font-medium text-blue-600 hover:underline cursor-pointer"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => openModal(holiday, "delete")}
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

export default HolidayTable;
