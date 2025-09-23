import { useEffect, useState } from "react";
import CalendarDays from "./CalendarDays";
import CalendarHeader from "./CalendarHeader";

type CalendarProps = {
   onDateChange?: (date: Date) => void;
   isSelectable?: boolean;
   isHeader?: boolean;
   isDays?: boolean;
};

const Calendar = ({
   onDateChange,
   isSelectable = true,
   isHeader = true,
   isDays = true,
}: CalendarProps) => {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [activeDate, setActiveDate] = useState(new Date());

   useEffect(() => {
      if (onDateChange) {
         onDateChange(activeDate);
      }
   }, [activeDate, onDateChange]);

   const handlePrevMonth = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
   };

   const handleNextMonth = () => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
   };

   return (
      <div className="container mx-auto">
         {isHeader && (
            <CalendarHeader
               currentDate={currentDate}
               onPrevMonth={isSelectable ? handlePrevMonth : undefined}
               onNextMonth={isSelectable ? handleNextMonth : undefined}
               isSelectable={isSelectable}
            />
         )}

         {isDays && (
            <CalendarDays
               currentDate={currentDate}
               activeDate={activeDate}
               onSelectDate={isSelectable ? setActiveDate : undefined}
               isSelectable={isSelectable}
            />
         )}
      </div>
   );
};

export default Calendar;
