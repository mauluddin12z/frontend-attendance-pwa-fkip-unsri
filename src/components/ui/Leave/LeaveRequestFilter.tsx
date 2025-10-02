"use client";
import React from "react";

export type LeaveFilterType =
   | "all"
   | "pending"
   | "approved"
   | "rejected"
   | "canceled";

interface LeaveRequestFilterProps {
   activeFilter: LeaveFilterType;
   onChange: (filter: LeaveFilterType) => void;
}

// Label list for filter buttons (Indonesian UI)
const filterLabels: { label: string; value: LeaveFilterType }[] = [
   { label: "Semua", value: "all" },
   { label: "Menunggu", value: "pending" },
   { label: "Disetujui", value: "approved" },
   { label: "Ditolak", value: "rejected" },
   { label: "Dibatalkan", value: "canceled" },
];

export default function LeaveRequestFilter({
   activeFilter,
   onChange,
}: LeaveRequestFilterProps) {
   // Generate button styles based on active filter
   const getButtonClass = (filter: LeaveFilterType) =>
      `flex justify-center items-center text-sm px-3 py-1 rounded-md cursor-pointer ${
         activeFilter === filter
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      }`;

   return (
      <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
         {filterLabels.map(({ label, value }) => (
            <button
               key={value}
               onClick={() => onChange(value)}
               className={getButtonClass(value)}
            >
               {label}
            </button>
         ))}
      </div>
   );
}
