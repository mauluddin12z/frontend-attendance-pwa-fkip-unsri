import { formatTime } from "@/utils/dateUtils";
import React from "react";

interface ScheduledTimeCardProps {
   icon: React.ReactNode;
   label: string;
   time: string;
   isLoading: boolean;
}

const ScheduledTimeCard: React.FC<ScheduledTimeCardProps> = ({
   icon,
   label,
   time,
   isLoading,
}) => {
   const displayTime = isLoading ? "Loading..." : formatTime(time);

   return (
      <div
         role="region"
         aria-label={`Scheduled time for ${label}`}
         className={`w-full h-32 bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center
                     transition-transform duration-200 cursor-default`}
      >
         <div
            className="p-2 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
            aria-hidden="true"
         >
            {icon}
         </div>

         <time
            className="mt-2 text-lg font-semibold text-gray-900"
            dateTime={time}
            aria-busy={isLoading}
         >
            {displayTime}
         </time>

         <p className="mt-1 text-sm text-gray-500 tracking-wide">{label}</p>
      </div>
   );
};

export default ScheduledTimeCard;
