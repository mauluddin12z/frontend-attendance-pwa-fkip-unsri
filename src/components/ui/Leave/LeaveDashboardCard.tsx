import React from "react";

interface LeaveDashboardCardProps {
   count: number;
   label: string;
   bgColor: string;
   borderColor: string;
}

export default function LeaveDashboardCard({
   count,
   label,
   bgColor,
   borderColor,
}: Readonly<LeaveDashboardCardProps>) {
   return (
      <div
         className={`${bgColor} border-2 ${borderColor} rounded-lg flex flex-col justify-center items-center h-24 p-2`}
      >
         <p className="text-xl font-bold">{count}</p>
         <p className="text-sm text-gray-700">{label}</p>
      </div>
   );
}
