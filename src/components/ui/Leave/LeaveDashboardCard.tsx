import React from "react";

interface LeaveDashboardCardProps {
   count: number;
   label: string;
   className?: string;
}

export default function LeaveDashboardCard({
   count,
   label,
   className,
}: Readonly<LeaveDashboardCardProps>) {
   return (
      <div
         className={`${className} border border-gray-200 bg-white shadow-sm rounded-lg flex flex-col justify-center items-center h-24 p-2`}
      >
         <p className="text-xl font-bold">{count}</p>
         <p className="text-sm text-gray-700">{label}</p>
      </div>
   );
}
