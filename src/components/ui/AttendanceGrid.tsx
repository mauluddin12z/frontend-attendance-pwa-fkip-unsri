import React from "react";
import AttendanceGridCard from "@/components/ui/AttendanceGridCard";
import { Attendance } from "@/types";
import CircleLoading from "./CircleLoading";

interface AttendanceGridProps {
   isLoadingAttendance: boolean;
   filteredDays: string[];
   getAttendanceForDay: (date: string) => Attendance | undefined;
}

const attendanceLegend = [
   { label: "Hadir", colorClass: "bg-green-400" },
   { label: "Tidak Hadir", colorClass: "bg-red-400" },
   { label: "Lainnya", colorClass: "bg-yellow-400" },
];

const AttendanceLegend: React.FC = () => (
   <div className="flex justify-center items-center gap-4 flex-wrap text-sm">
      {attendanceLegend.map(({ label, colorClass }) => (
         <div key={label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${colorClass}`} />
            <span>{label}</span>
         </div>
      ))}
   </div>
);

const AttendanceGrid: React.FC<AttendanceGridProps> = ({
   isLoadingAttendance,
   filteredDays,
   getAttendanceForDay,
}) => {
   return (
      <div className="flex flex-col gap-4">
         {/* Legend */}
         <AttendanceLegend />

         {/* Loading or Grid */}
         {isLoadingAttendance ? (
            <CircleLoading />
         ) : filteredDays.length > 0 ? (
            <div className="grid grid-cols-5 gap-2">
               {filteredDays.map((day, index) => (
                  <AttendanceGridCard
                     key={day + index} // key improved: day + index for uniqueness
                     day={day}
                     attendance={getAttendanceForDay(day)}
                  />
               ))}
            </div>
         ) : (
            <div className="col-span-5 text-center text-gray-500">
               No attendance records for this month.
            </div>
         )}
      </div>
   );
};

export default AttendanceGrid;
