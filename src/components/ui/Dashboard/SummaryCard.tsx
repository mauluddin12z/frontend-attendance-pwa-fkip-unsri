import React, { ReactNode } from "react";

export default function SummaryCard({
   icon,
   title,
   number,
}: {
   icon: ReactNode;
   title: string;
   number: number;
}) {
   return (
      <div className="border border-gray-200 rounded-lg flex flex-col gap-y-6 p-6  shadow-sm">
         <div className="flex items-center">
            <div className="w-6 h-6 mr-2">{icon}</div>
            <div className="font-medium text-gray-600">{title}</div>
         </div>
         <div className="font-semibold text-4xl">{number}</div>
      </div>
   );
}
