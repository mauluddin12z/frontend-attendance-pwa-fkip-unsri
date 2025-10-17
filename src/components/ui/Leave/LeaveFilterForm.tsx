import { useState, useEffect } from "react";
import customMoment from "@/utils/customMoment";
import { useForm } from "react-hook-form";

interface LeaveFilterFormProps {
   handleFilterSubmit: React.FormEventHandler<HTMLFormElement>;
   register: ReturnType<typeof useForm>["register"];
   setValue: ReturnType<typeof useForm>["setValue"];
}

type QuickFilterType = "today" | "thisMonth" | "thisYear" | null;

const LeaveFilterForm = ({
   handleFilterSubmit,
   register,
   setValue,
}: LeaveFilterFormProps) => {
   // Tracks selected quick filter button
   const [quickTimeFilter, setQuickTimeFilter] =
      useState<QuickFilterType>(null);

   // Display values for date inputs (YYYY-MM-DD)
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");

   // Full datetime values to send to the backend (YYYY-MM-DD HH:mm:ss)
   const [startDateTime, setStartDateTime] = useState("");
   const [endDateTime, setEndDateTime] = useState("");

   // Get start and end datetime based on quick filter
   const getDateRange = (type: Exclude<QuickFilterType, null>) => {
      switch (type) {
         case "today": {
            const start = customMoment()
               .startOf("day")
               .format("YYYY-MM-DD HH:mm:ss");
            const end = customMoment()
               .endOf("day")
               .format("YYYY-MM-DD HH:mm:ss");
            return { start, end };
         }
         case "thisMonth": {
            const start = customMoment()
               .startOf("month")
               .format("YYYY-MM-DD HH:mm:ss");
            const end = customMoment()
               .endOf("month")
               .format("YYYY-MM-DD HH:mm:ss");
            return { start, end };
         }
         case "thisYear": {
            const start = customMoment()
               .startOf("year")
               .format("YYYY-MM-DD HH:mm:ss");
            const end = customMoment()
               .endOf("year")
               .format("YYYY-MM-DD HH:mm:ss");
            return { start, end };
         }
      }
   };

   // Apply quick filter and set both input display and full datetime values
   const applyQuickTimeFilter = (type: Exclude<QuickFilterType, null>) => {
      const { start, end } = getDateRange(type);

      setStartDate(start.slice(0, 10)); // display only date
      setEndDate(end.slice(0, 10));

      setStartDateTime(start); // backend uses full datetime
      setEndDateTime(end);

      setQuickTimeFilter(type);
   };

   // Handle manual date changes for start
   const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setStartDate(date);
      setStartDateTime(`${date} 00:00:00`);
      setQuickTimeFilter(null); // disable quick filter
   };

   // Handle manual date changes for end
   const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setEndDate(date);
      setEndDateTime(`${date} 23:59:59`);
      setQuickTimeFilter(null);
   };

   // Sync full datetime with form state
   useEffect(() => {
      setValue("startDate", startDateTime);
      setValue("endDate", endDateTime);
   }, [startDateTime, endDateTime, setValue]);

   return (
      <div className="flex w-full">
         <form
            onSubmit={handleFilterSubmit}
            className="space-y-4 px-6 py-4 w-full"
         >
            {/* Status Dropdown */}
            <div>
               <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
               >
                  Status
               </label>
               <select
                  id="status"
                  {...register("status")}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  <option value="">Semua</option>
                  <option value="menunggu persetujuan">
                     Menunggu persetujuan
                  </option>
                  <option value="disetujui">Disetujui</option>
                  <option value="ditolak">Ditolak</option>
               </select>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex gap-2">
               {(["today", "thisMonth", "thisYear"] as const).map((type) => (
                  <button
                     key={type}
                     type="button"
                     onClick={() => applyQuickTimeFilter(type)}
                     className={`px-3 py-1 text-sm rounded-md border border-gray-300 cursor-pointer ${
                        quickTimeFilter === type
                           ? "bg-blue-500 text-white"
                           : "bg-white text-gray-700"
                     }`}
                  >
                     {type === "today"
                        ? "Hari Ini"
                        : type === "thisMonth"
                        ? "Bulan Ini"
                        : "Tahun Ini"}
                  </button>
               ))}
            </div>

            {/* Date Range Inputs */}
            <div>
               <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Rentang Waktu
               </label>
               <div className="grid grid-cols-2 gap-x-2 w-full">
                  <input
                     type="date"
                     id="startDate"
                     {...register("startDate")}
                     value={startDate}
                     onChange={handleStartDateChange}
                     className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                     type="date"
                     id="endDate"
                     {...register("endDate")}
                     value={endDate}
                     onChange={handleEndDateChange}
                     className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>
            </div>
         </form>
      </div>
   );
};

export default LeaveFilterForm;
