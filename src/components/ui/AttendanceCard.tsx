import { useAnimatedTime } from "@/hooks/useAnimateTime";
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
   const shouldAnimate = isLoading || !time;
   const animatedTime = useAnimatedTime(shouldAnimate, time);
   return (
      <div className="w-full h-32 bg-white shadow p-3 rounded-lg">
         <div className="flex flex-col h-full">
            <div className="flex items-center just">
               <div className="p-2 w-10 h-10 bg-blue-100 rounded-lg">
                  {icon}
               </div>
               <div className="ml-3 text-sm">{label}</div>
            </div>
            <time
               dateTime={time}
               className="flex justify-center items-center text-base font-semibold h-full"
            >
               {animatedTime}
            </time>
         </div>
      </div>
   );
};

export default AttendanceCard;
