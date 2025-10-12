import { useState, useEffect } from "react";
import { AttendanceStatus } from "@/types";
import customMoment from "@/utils/customMoment";
import { useForm } from "react-hook-form";

interface AttendanceFilterFormProps {
   handleFilterSubmit: React.FormEventHandler<HTMLFormElement>;
   attendanceStatuses: AttendanceStatus[];
   register: ReturnType<typeof useForm>["register"];
   setValue: ReturnType<typeof useForm>["setValue"];
}

type QuickFilterType = "today" | "thisMonth" | "thisYear" | null;

const AttendanceFilterForm = ({
   handleFilterSubmit,
   attendanceStatuses,
   register,
   setValue,
}: AttendanceFilterFormProps) => {
   const [quickTimeFilter, setQuickTimeFilter] =
      useState<QuickFilterType>(null);
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");

   const getDateRange = (type: Exclude<QuickFilterType, null>) => {
      switch (type) {
         case "today": {
            const today = customMoment().format("YYYY-MM-DD");
            return { start: today, end: today };
         }
         case "thisMonth": {
            return {
               start: customMoment().startOf("month").format("YYYY-MM-DD"),
               end: customMoment().endOf("month").format("YYYY-MM-DD"),
            };
         }
         case "thisYear": {
            return {
               start: customMoment().startOf("year").format("YYYY-MM-DD"),
               end: customMoment().endOf("year").format("YYYY-MM-DD"),
            };
         }
      }
   };

   const applyQuickTimeFilter = (type: Exclude<QuickFilterType, null>) => {
      const { start, end } = getDateRange(type);
      setStartDate(start);
      setEndDate(end);
      setQuickTimeFilter(type);
   };

   const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(e.target.value);
      setQuickTimeFilter(null);
   };

   const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value);
      setQuickTimeFilter(null);
   };

   useEffect(() => {
      setValue("startDate", startDate);
      setValue("endDate", endDate);
   }, [startDate, endDate, setValue]);

   return (
      <div className="flex w-full">
         <form
            onSubmit={handleFilterSubmit}
            className="space-y-4 px-6 py-4 w-full"
         >
            {/* Attendance Status Dropdown */}
            <div>
               <label
                  htmlFor="attendanceStatusId"
                  className="block text-sm font-medium text-gray-700"
               >
                  Status Absensi
               </label>
               <select
                  id="attendanceStatusId"
                  {...register("attendanceStatusId")}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  <option value="">Semua</option>
                  {attendanceStatuses.map((status) => (
                     <option key={status.id} value={status.id}>
                        {status.name}
                     </option>
                  ))}
               </select>
            </div>

            {/* Quick Filter Buttons */}
            <div>
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
            </div>

            {/* Date Inputs */}

            <div>
               <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
               >
                  Rentang waktu
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

export default AttendanceFilterForm;
