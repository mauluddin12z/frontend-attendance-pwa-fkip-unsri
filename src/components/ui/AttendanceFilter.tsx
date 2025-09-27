"use client";
import React, { useState } from "react";

interface AttendanceFilterProps {
   filter: string;
   setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const FILTER_OPTIONS = [
   {
      value: "semua",
      label: "Semua",
      bgColor: "bg-blue-600",
      textColor: "text-white",
   },
   {
      value: "hadir",
      label: "Hadir",
      bgColor: "bg-green-600",
      textColor: "text-white",
   },
   {
      value: "tidak_hadir",
      label: "Tidak Hadir",
      bgColor: "bg-red-600",
      textColor: "text-white",
   },
   {
      value: "lainnya",
      label: "Lainnya",
      bgColor: "bg-yellow-400",
      textColor: "text-black",
   },
];

const AttendanceFilter: React.FC<AttendanceFilterProps> = ({
   filter,
   setFilter,
}) => {
   return (
      <div className="overflow-x-auto scrollbar-hide">
         <div className="flex gap-3 whitespace-nowrap">
            {FILTER_OPTIONS.map(({ value, label, bgColor, textColor }) => {
               const isActive = filter === value;
               const baseStyle =
                  "cursor-pointer select-none px-5 py-2 rounded-lg font-medium text-sm transition duration-300 ease-in-out flex items-center justify-center";

               const activeStyle = `${bgColor} ${textColor} shadow-md`;
               const inactiveStyle =
                  "bg-gray-200 text-gray-700 hover:bg-gray-300";

               return (
                  <button
                     key={value}
                     onClick={() => setFilter(value)}
                     aria-pressed={isActive}
                     className={`${baseStyle} ${
                        isActive ? activeStyle : inactiveStyle
                     }`}
                     type="button"
                  >
                     {label}
                  </button>
               );
            })}
         </div>
      </div>
   );
};

export default AttendanceFilter;
