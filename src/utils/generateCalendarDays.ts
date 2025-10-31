import { Moment } from "moment";

// Generate full calendar grid (including padding days)
const generateCalendarDays = (currentMoment: Moment): Moment[] => {
   const startOfMonth = currentMoment.clone().startOf("month");
   const endOfMonth = currentMoment.clone().endOf("month");

   const calendarStart = startOfMonth.clone().startOf("week");
   const calendarEnd = endOfMonth.clone().endOf("week");

   const days: Moment[] = [];
   const day = calendarStart.clone();

   while (day.isSameOrBefore(calendarEnd, "day")) {
      days.push(day.clone());
      day.add(1, "day");
   }

   return days;
};

export default generateCalendarDays;
