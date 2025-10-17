"use client";
import { useQuickDateFilter } from "@/hooks/misc";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface AuditLogFilterFormProps {
   handleFilterSubmit: React.FormEventHandler<HTMLFormElement>;
   register: ReturnType<typeof useForm>["register"];
   setValue: ReturnType<typeof useForm>["setValue"];
}

type ActionType = "create" | "update" | "delete" | null;

export default function AuditLogFilterForm({
   handleFilterSubmit,
   register,
   setValue,
}: AuditLogFilterFormProps) {
   const {
      quickFilter,
      startDate,
      endDate,
      applyQuickFilter,
      handleStartDateChange,
      handleEndDateChange,
   } = useQuickDateFilter(setValue);

   const [actionFilter, setActionFilter] = useState<ActionType>(null);

   const applyActionFilter = (action: ActionType) => {
      setActionFilter(action);
      setValue("action", action);
   };

   useEffect(() => {
      // Ensuring the form values are updated when the dates are changed
      setValue("startDate", startDate);
      setValue("endDate", endDate);
   }, [startDate, endDate, setValue]);

   return (
      <form
         onSubmit={handleFilterSubmit}
         className="space-y-4 px-6 py-4 w-full rounded-md bg-white shadow-sm"
      >
         {/* Action Filter Buttons */}
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Tipe Aksi
            </label>
            <div className="flex gap-2">
               {(["create", "update", "delete"] as const).map((action) => (
                  <button
                     key={action}
                     type="button"
                     onClick={() => applyActionFilter(action)}
                     className={`px-3 py-1 text-sm rounded-md border cursor-pointer ${
                        actionFilter === action
                           ? "bg-green-600 text-white border-green-600"
                           : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                     }`}
                  >
                     {action === "create"
                        ? "Create"
                        : action === "update"
                        ? "Update"
                        : "Delete"}
                  </button>
               ))}
            </div>
         </div>

         {/* Quick Time Filter Buttons */}
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
