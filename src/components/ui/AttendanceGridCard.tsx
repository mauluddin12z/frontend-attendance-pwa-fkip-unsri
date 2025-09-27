import React from "react";
import moment from "moment-timezone";
import { Attendance } from "@/types";

type AttendanceGridCardProps = {
   day: string;
   attendance?: Attendance;
};

const AttendanceGridCard: React.FC<AttendanceGridCardProps> = ({
   day,
   attendance,
}) => {
   const statusName = attendance?.attendanceStatus?.name;

   let textClass = "text-black";
   let borderClass = "border-gray-200";
   let dotClass = "bg-white";

   if (statusName === "Hadir") {
      borderClass = "border-green-400";
      dotClass = "bg-green-400";
   } else if (statusName === "Tidak Hadir") {
      borderClass = "border-red-400";
      dotClass = "bg-red-400";
   } else if (statusName && !["Hadir", "Tidak Hadir"].includes(statusName)) {
      borderClass = "border-yellow-400";
      dotClass = "bg-yellow-400";
   }

   return (
      <div
         className={`bg-white border p-3 rounded-md ${textClass} ${borderClass}`}
      >
         <div className="flex flex-col items-center gap-y-2">
            <span className="font-medium text-sm">
               {moment(day).format("D")}
            </span>
            <div
               className={`w-2.5 h-2.5 rounded-full ${dotClass}`}
               title={statusName || "No Status"}
            />
         </div>
      </div>
   );
};

export default AttendanceGridCard;
