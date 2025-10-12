import React from "react";
import { formatTime } from "@/utils/dateUtils";
import { Attendance } from "@/types";
import customMoment from "@/utils/customMoment";
import {
   AttendanceStatusName,
   attendanceStatusStyle,
} from "@/utils/attendanceStatusStyle";

type AttendanceListCardProps = {
   day: string;
   attendance?: Attendance;
};

const getStatusStyle = (status?: string): string => {
   const isValidStatus = (status: string): status is AttendanceStatusName =>
      status in attendanceStatusStyle;

   return status && isValidStatus(status)
      ? `${attendanceStatusStyle[status].bgColor} ${attendanceStatusStyle[status].borderColor}`
      : "bg-gray-100 border-gray-300";
};

const AttendanceListCard: React.FC<AttendanceListCardProps> = ({
   day,
   attendance,
}) => {
   const { attendanceDetails = [], attendanceStatus } = attendance || {};
   const statusName = attendanceStatus?.name || "---";

   const checkIn = attendanceDetails.find(
      (detail) => detail.type === "checkIn"
   );
   const checkOut = attendanceDetails.find(
      (detail) => detail.type === "checkOut"
   );

   const statusStyle = getStatusStyle(
      statusName !== "---" ? statusName : undefined
   );

   return (
      <div className="relative overflow-clip bg-white border border-gray-200 rounded-lg p-4 mb-2 w-full">
         <div className="flex justify-between gap-x-10 items-center">
            <span className="font-medium text-sm text-gray-700">
               {customMoment(day).format("D MMMM YYYY")}
            </span>
            <span
               className={`font-medium text-xs text-gray-700 py-1 px-4 border-2 rounded-full lowercase ${statusStyle}`}
            >
               {statusName}
            </span>
         </div>

         <div className="border border-gray-200 py-2 mt-4 rounded-lg grid grid-cols-2">
            <div className="py-2 px-4 border-r border-gray-200 flex flex-col">
               <span className="text-xs font-semibold">Check-in</span>
               <span className="text-xs mt-2">
                  {formatTime(checkIn?.timestamp) || "---"}
               </span>
            </div>
            <div className="py-2 px-4 flex flex-col">
               <span className="text-xs font-semibold">Check-out</span>
               <span className="text-xs mt-2">
                  {formatTime(checkOut?.timestamp) || "---"}
               </span>
            </div>
         </div>
      </div>
   );
};

export default AttendanceListCard;
