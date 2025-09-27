"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

type CalendarHeaderProps = {
   currentDate: Date;
   onPrevMonth?: () => void;
   onNextMonth?: () => void;
   isSelectable?: boolean;
};

const CalendarHeader = ({
   currentDate,
   onPrevMonth,
   onNextMonth,
   isSelectable = true,
}: CalendarHeaderProps) => {
   const monthYear = currentDate.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
   });

   return (
      <div
         className={`flex ${
            isSelectable ? "justify-between" : "justify-center"
         } items-center`}
      >
         {isSelectable && (
            <button
               onClick={onPrevMonth}
               className="text-2xl px-4 py-2 rounded-full text-gray-600"
            >
               <FontAwesomeIcon icon={faAngleLeft} />
            </button>
         )}
         <h2 className="text-xl font-semibold">{monthYear}</h2>
         {isSelectable && (
            <button
               onClick={onNextMonth}
               className="text-2xl px-4 py-2 rounded-full text-gray-600"
            >
               <FontAwesomeIcon icon={faAngleRight} />
            </button>
         )}
      </div>
   );
};

export default CalendarHeader;
