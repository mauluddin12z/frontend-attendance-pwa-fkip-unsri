// input = timestamp

import customMoment from "./customMoment";

export function formatTime(
   input?: string | number | Date,
   format: string = "HH:mm:ss",
   fallback: string = "---"
): string {
   if (!input || !customMoment(input).isValid()) {
      return fallback;
   }
   return customMoment(input).format(format);
}

export function formatDate(
   input?: string | number | Date,
   format: string = "D MMMM YYYY",
   fallback: string = "---"
): string {
   return formatTime(input, format, fallback);
}

export function formatDateTime(
   input?: string | number | Date,
   format: string = "D MMM YYYY, HH:mm",
   fallback: string = "---"
): string {
   return formatTime(input, format, fallback);
}
