"use client";
import { useAttendanceStatuses } from "@/hooks/attendance";
import { useQuickDateFilter } from "@/hooks/misc";
import { AttendanceStatus } from "@/types";
import { useForm } from "react-hook-form";

interface AttendanceFilterFormProps {
   handleFilterSubmit: React.FormEventHandler<HTMLFormElement>;
   register: ReturnType<typeof useForm>["register"];
   setValue: ReturnType<typeof useForm>["setValue"];
}

export default function AttendanceFilterForm({
   handleFilterSubmit,
   register,
   setValue,
}: AttendanceFilterFormProps) {
   const { attendanceStatuses, isLoading } = useAttendanceStatuses();

   const {
      quickFilter,
      startDate,
      endDate,
      applyQuickFilter,
      handleStartDateChange,
      handleEndDateChange,
   } = useQuickDateFilter(setValue);

   return (
      <form
         onSubmit={handleFilterSubmit}
         className="space-y-4 px-6 py-4 w-full rounded-md bg-white shadow-sm"
      >
         {/* Attendance Status */}
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Status Absensi
            </label>
            <select
               id="attendanceStatusId"
               {...register("attendanceStatusId")}
               className="w-full border border-gray-300 px-3 py-2 rounded-md"
            >
               <option value="">Semua</option>
               {isLoading ? (
                  <option value="">Memuat...</option>
               ) : (
                  attendanceStatuses?.data?.map((status: AttendanceStatus) => (
                     <option key={status.id} value={status.id}>
                        {status.name}
                     </option>
                  ))
               )}
            </select>
         </div>

         {/* Quick Filter Buttons */}
         <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Waktu Cepat
         </label>
         <div className="flex gap-2">
            {(["today", "thisMonth", "thisYear"] as const).map((type) => (
               <button
                  key={type}
                  type="button"
                  onClick={() => applyQuickFilter(type)}
                  className={`px-3 py-1 text-sm rounded-md border cursor-pointer ${
                     quickFilter === type
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Rentang Waktu
            </label>
            <div className="grid grid-cols-2 gap-x-2">
               <input
                  type="date"
                  {...register("startDate")}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
               />
               <input
                  type="date"
                  {...register("endDate")}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
               />
            </div>
         </div>
      </form>
   );
}
