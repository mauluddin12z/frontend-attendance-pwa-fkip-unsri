import moment from "moment";
import React from "react";

// Reusable card component
const AttendanceCard = ({
   icon,
   label,
   time,
   isLoading,
}: {
   icon: React.ReactNode;
   label: string;
   time: string;
   isLoading: boolean;
}) => {
   const displayTime = isLoading ? "Loading..." : time ? time : "---";
   return (
      <div className="w-full h-32 bg-white shadow p-4 rounded-lg relative">
         <div className="p-2 w-10 h-10 bg-blue-100 rounded-lg absolute top-2 left-2">
            {icon}
         </div>
         <div className="flex flex-col h-full">
            <div className="flex items-center justify-center">
               <div className="ml-3 text-sm">{label}</div>
            </div>
            <time
               className="mt-2 text-lg font-semibold text-gray-900 flex flex-1 justify-center items-center"
               dateTime={time}
               aria-busy={isLoading}
            >
               {displayTime}
            </time>
         </div>
      </div>
   );
};

export default AttendanceCard;
