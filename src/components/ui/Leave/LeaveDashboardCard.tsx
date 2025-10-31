import React from "react";

interface LeaveDashboardCardProps {
   count: number;
   label: string;
   gradient?: string;
}

export default function LeaveDashboardCard({
   count,
   label,
   gradient = "from-blue-200 to-indigo-300",
}: Readonly<LeaveDashboardCardProps>) {
   return (
      <div
         className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all bg-gradient-to-br ${gradient} text-white`}
      >
         <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
         <div className="relative flex flex-col justify-center items-center h-28 p-4">
            <p className="text-3xl font-extrabold tracking-tight">{count}</p>
            <p className="text-sm font-medium mt-1 opacity-90">{label}</p>
         </div>
      </div>
   );
}
