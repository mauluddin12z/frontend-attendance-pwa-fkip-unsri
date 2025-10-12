import React from "react";

// Define the expected prop type
interface LegendItem {
   label: string;
   colorClass: string;
}

interface AttendanceLegendProps {
   attendanceLegend: LegendItem[];
}

const AttendanceLegend: React.FC<AttendanceLegendProps> = ({
   attendanceLegend,
}) => (
   <div className="flex justify-start ml-4 items-center gap-2.5 flex-wrap text-xs lowercase">
      {attendanceLegend.map(({ label, colorClass }) => (
         <div key={label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${colorClass}`} />
            <span>{label}</span>
         </div>
      ))}
   </div>
);

export default AttendanceLegend;
