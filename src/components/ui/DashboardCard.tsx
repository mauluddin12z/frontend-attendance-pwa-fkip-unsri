import React from "react";

interface DashboardCardProps {
   icon: any;
   label: string;
   isLoading: boolean;
   data: number;
   cardColor: string;
   iconColor: string;
}

export default function DashboardCard({
   icon,
   label,
   isLoading,
   data,
   cardColor,
   iconColor,
}: Readonly<DashboardCardProps>) {
   return (
      <div
         className={`p-5 ${cardColor} rounded-lg shadow flex items-center gap-4`}
      >
         <div className={`${iconColor} text-white p-3 rounded-full`}>
            {icon}
         </div>
         <div>
            <h3 className="text-sm font-semibold text-gray-600">{label}</h3>
            <p className="text-2xl font-bold text-gray-800">
               {isLoading ? "Loading..." : data}
            </p>
         </div>
      </div>
   );
}
