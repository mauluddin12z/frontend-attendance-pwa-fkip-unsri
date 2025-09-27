"use client";

import { useEffect, useRef } from "react";

type CalendarDaysProps = {
   currentDate: Date;
   activeDate: Date;
   onSelectDate?: (date: Date) => void;
   isSelectable?: boolean;
};

const CalendarDays = ({
   currentDate,
   activeDate,
   onSelectDate,
   isSelectable = true,
}: CalendarDaysProps) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const activeRef = useRef<HTMLButtonElement>(null);

   const generateDaysInMonth = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const days: Date[] = [];
      for (
         let d = new Date(firstDay);
         d <= lastDay;
         d.setDate(d.getDate() + 1)
      ) {
         days.push(new Date(d));
      }

      return days;
   };

   const isSameDate = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

   useEffect(() => {
      if (activeRef.current && containerRef.current) {
         const container = containerRef.current;
         const active = activeRef.current;

         const containerRect = container.getBoundingClientRect();
         const activeRect = active.getBoundingClientRect();

         const offset =
            activeRect.left - containerRect.left + container.scrollLeft;

         const scrollTo =
            offset - container.clientWidth / 2 + active.clientWidth / 2;

         container.scrollTo({
            left: scrollTo,
            behavior: "smooth",
         });
      }
   }, [currentDate, isSelectable]);

   const days = generateDaysInMonth();

   return (
      <div
         ref={containerRef}
         className={`flex space-x-3 pb-4 ${
            isSelectable ? "overflow-x-auto scrollbar-hide" : "overflow-hidden"
         }`}
      >
         {days.map((day, index) => {
            const isActive = isSameDate(day, activeDate);
            const dayName = day.toLocaleDateString("id-ID", {
               weekday: "short",
            });
            const dayOfMonth = String(day.getDate()).padStart(2, "0");

            return (
               <div key={index} className="flex-shrink-0">
                  <button
                     ref={isActive ? activeRef : null}
                     onClick={() =>
                        isSelectable && onSelectDate?.(new Date(day))
                     }
                     disabled={!isSelectable}
                     className={`w-20 h-20 flex flex-col items-center justify-center rounded-lg shadow-md border border-gray-200 font-semibold transition-colors duration-200 ${
                        isActive
                           ? "bg-blue-400 text-white"
                           : "bg-white text-black"
                     }`}
                  >
                     <div className="text-lg font-semibold">{dayOfMonth}</div>
                     <div className="text-xs font-light">{dayName}</div>
                  </button>
               </div>
            );
         })}
      </div>
   );
};

export default CalendarDays;
