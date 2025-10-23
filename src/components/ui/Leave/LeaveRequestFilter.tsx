"use client";
import React from "react";

export type LeaveFilterType =
   | "semua"
   | "menunggu persetujuan"
   | "disetujui"
   | "ditolak"
   | "dibatalkan";

interface LeaveRequestFilterProps {
   activeFilter: LeaveFilterType;
   onChange: (filter: LeaveFilterType) => void;
}

// Label list for filter buttons (Indonesian UI)
const filterLabels: { label: string; value: LeaveFilterType }[] = [
   { label: "Semua", value: "semua" },
   { label: "Menunggu Persetujuan", value: "menunggu persetujuan" },
   { label: "Disetujui", value: "disetujui" },
   { label: "Ditolak", value: "ditolak" },
   { label: "Dibatalkan", value: "dibatalkan" },
];

export default function LeaveRequestFilter({
   activeFilter,
   onChange,
}: Readonly<LeaveRequestFilterProps>) {
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
               className={`${getButtonClass(value)} text-nowrap`}
            >
               {label}
            </button>
         ))}
      </div>
   );
}
