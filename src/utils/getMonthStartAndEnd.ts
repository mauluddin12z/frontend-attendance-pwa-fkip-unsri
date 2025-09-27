import moment from "moment-timezone";
import { TIMEZONE } from "./constants";

// Helper function for date manipulation
const getMonthStartAndEnd = (date: Date) => {
   const start = moment.tz(date, TIMEZONE).startOf("month");
   const end = moment.tz(date, TIMEZONE).endOf("month");
   return { start, end };
};

export default getMonthStartAndEnd