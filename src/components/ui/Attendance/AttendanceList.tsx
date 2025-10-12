import AttendanceListCard from "@/components/ui/Attendance/AttendanceListCard";
import { Attendance } from "@/types";
import CircleLoading from "../Loading/LoadingSpinner";

interface AttendanceListProps {
   isLoadingAttendance: boolean;
   filteredDays: string[];
   getAttendanceForDay: (date: string) => Attendance | undefined;
}

const AttendanceList: React.FC<AttendanceListProps> = ({
   isLoadingAttendance,
   filteredDays,
   getAttendanceForDay,
}) => {
   return (
      <div className="flex flex-col">
         {isLoadingAttendance ? (
            <CircleLoading />
         ) : filteredDays.length > 0 ? (
            filteredDays.map((day, index) => {
               const attendance = getAttendanceForDay(day);

               return (
                  <AttendanceListCard
                     key={index}
                     day={day}
                     attendance={attendance}
                  />
               );
            })
         ) : (
            <div className="text-center">Tidak ditemukan data absensi.</div>
         )}
      </div>
   );
};

export default AttendanceList;
