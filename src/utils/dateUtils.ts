import moment from "moment";

// input = timestamp

export function formatTime(
   input?: string | number | Date,
   format: string = "HH:mm:ss",
   fallback: string = "---"
): string {
   if (!input || !moment(input).isValid()) {
      return fallback;
   }
   return moment(input).format(format);
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
