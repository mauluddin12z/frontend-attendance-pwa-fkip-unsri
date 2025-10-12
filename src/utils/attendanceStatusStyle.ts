export type AttendanceStatusName =
   | "Hadir"
   | "Tidak Hadir"
   | "Izin"
   | "Libur"
   | "Lainnya";

export const attendanceStatusStyle: Record<
   AttendanceStatusName,
   {
      label: string;
      dotColor: string;
      bgColor: string;
      borderColor: string;
   }
> = {
   Hadir: {
      label: "Hadir",
      dotColor: "bg-green-500",
      bgColor: "bg-green-200",
      borderColor: "border-green-500",
   },
   "Tidak Hadir": {
      label: "Tidak Hadir",
      dotColor: "bg-rose-500",
      bgColor: "bg-rose-200",
      borderColor: "border-rose-500",
   },
   Izin: {
      label: "Izin",
      dotColor: "bg-amber-400",
      bgColor: "bg-amber-200",
      borderColor: "border-amber-400",
   },
   Libur: {
      label: "Libur",
      dotColor: "bg-sky-400",
      bgColor: "bg-sky-200",
      borderColor: "border-sky-400",
   },
   Lainnya: {
      label: "Lainnya",
      dotColor: "bg-slate-400",
      bgColor: "bg-slate-200",
      borderColor: "border-slate-400",
   },
};
