import React from "react";
import { formatTime } from "@/utils/dateUtils";
import momentTimezone from "moment-timezone";
import moment from "moment";
import { Attendance } from "@/types";

type AttendanceListCardProps = {
   day: string;
   attendance?: Attendance;
};

const AttendanceListCard: React.FC<AttendanceListCardProps> = ({
   day,
   attendance,
}) => {
   const checkIn = attendance?.attendanceDetails?.find(
      (detail: any) => detail.type === "checkIn"
   );
   const checkOut = attendance?.attendanceDetails?.find(
      (detail: any) => detail.type === "checkOut"
   );

   return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-2">
         <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-gray-700">
               {moment(day).locale("id").format("D MMMM YYYY")}
            </span>
            <span
               className={`font-medium text-xs text-gray-700 py-2 px-4 border-2 rounded-full ${
                  attendance?.attendanceStatus?.name === "Hadir"
                     ? "bg-green-200 border-green-400"
                     : attendance?.attendanceStatus?.name === "Tidak Hadir"
                     ? "bg-red-200 border-red-400"
                     : attendance?.attendanceStatus?.name &&
                       !["Tidak Hadir", "Hadir", null].includes(
                          attendance?.attendanceStatus?.name
                       )
                     ? "bg-yellow-200 border-yellow-400"
                     : "bg-gray-100 border-gray-300"
               }`}
            >
               {attendance?.attendanceStatus?.name || "---"}
            </span>
         </div>

         <div className="border border-gray-200 py-2 mt-4 rounded-lg grid grid-cols-2">
            <div className="py-2 px-4 border-r border-gray-200 flex flex-col">
               <span className="text-xs font-semibold">
                  {checkIn?.type === "checkIn" ? "Check-in" : "---"}
               </span>
               <span className="text-xs mt-2">
                  {formatTime(checkIn?.timestamp)}
               </span>
            </div>
            <div className="py-2 px-4 flex flex-col">
               <span className="text-xs font-semibold">
                  {checkOut?.type === "checkOut" ? "Check-out" : "---"}
               </span>
               <span className="text-xs mt-2">
                  {formatTime(checkOut?.timestamp)}
               </span>
            </div>
         </div>
      </div>
   );
};

export default AttendanceListCard;
