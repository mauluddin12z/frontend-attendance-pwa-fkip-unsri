import customMoment from "./customMoment";

// Helper function for date manipulation
const getMonthStartAndEnd = (date: Date) => {
   const start = customMoment(date).startOf("month");
   const end = customMoment(date).endOf("month");
   return { start, end };
};

export default getMonthStartAndEnd;
