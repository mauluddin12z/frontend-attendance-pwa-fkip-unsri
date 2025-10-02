import React, { useState } from "react";
import { Moment } from "moment";
import customMoment from "@/utils/customMoment";

import AttendanceGridCard from "@/components/ui/Attendance/AttendanceGridCard";
import { Attendance } from "@/types";
import CircleLoading from "../LoadingSpinner";
import generateCalendarDays from "@/utils/generateCalendarDays";
import AttendanceLegend from "./AttendanceLegend";
import { attendanceStatusStyle } from "@/utils/attendanceStatusStyle";

interface AttendanceGridProps {
   isLoadingAttendance: boolean;
   getAttendanceForDay: (date: string) => Attendance | undefined;
   currentDate: Date;
}

const attendanceLegend = Object.values(attendanceStatusStyle).map(
   ({ label, dotColor }) => ({
      label,
      colorClass: dotColor,
   })
);

const AttendanceGrid: React.FC<AttendanceGridProps> = ({
   isLoadingAttendance,
   getAttendanceForDay,
   currentDate,
}) => {
   const currentMoment = customMoment(currentDate);
   const calendarDays = generateCalendarDays(currentMoment);
   const weekdays = customMoment.weekdays();
   return (
      <div className="flex flex-col gap-4">
         {/* Loading state */}
         {isLoadingAttendance ? (
            <CircleLoading />
         ) : (
            <>
               {/* Weekday headers (shortened to 3 characters) */}
               <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600">
                  {weekdays.map((day) => (
                     <div key={day}>{day.slice(0, 3)}</div>
                  ))}
               </div>

               {/* Calendar grid */}
               <div className="grid grid-cols-7">
                  {calendarDays.map((date, index) => {
                     const dateStr = date.format("YYYY-MM-DD");
                     const attendance = getAttendanceForDay(dateStr);
                     const isOutsideMonth = !date.isSame(
                        currentMoment,
                        "month"
                     );

                     return (
                        <div
                           key={`${dateStr}-${index}`}
                           className={isOutsideMonth ? "text-gray-400" : ""}
                        >
                           <AttendanceGridCard
                              day={dateStr}
                              attendance={attendance}
                              isOutsideMonth={isOutsideMonth}
                           />
                        </div>
                     );
                  })}
               </div>
            </>
         )}

         {/* Legend */}
         <AttendanceLegend attendanceLegend={attendanceLegend} />
      </div>
   );
};

export default AttendanceGrid;
