export default function getTimeFromISO8601(isoTimestamp: string): string {
   // Create a new Date object from the ISO timestamp
   const date = new Date(isoTimestamp);

   // Extract the hours, minutes, and seconds in UTC
   const hours: string = String(date.getUTCHours()).padStart(2, "0");
   const minutes: string = String(date.getUTCMinutes()).padStart(2, "0");
   const seconds: string = String(date.getUTCSeconds()).padStart(2, "0");

   // Return the time in HH:MM:SS format
   return `${hours}:${minutes}:${seconds}`;
}
