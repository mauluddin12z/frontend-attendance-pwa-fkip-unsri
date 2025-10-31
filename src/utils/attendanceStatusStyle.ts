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
      textColor: string;
   }
> = {
   Hadir: {
      label: "Hadir",
      dotColor: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-700",
   },
   "Tidak Hadir": {
      label: "Tidak Hadir",
      dotColor: "bg-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300",
      textColor: "text-rose-700",
   },
   Izin: {
      label: "Izin",
      dotColor: "bg-amber-400",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-400",
      textColor: "text-amber-700",
   },
   Libur: {
      label: "Libur",
      dotColor: "bg-sky-400",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-400",
      textColor: "text-sky-700",
   },
   Lainnya: {
      label: "Lainnya",
      dotColor: "bg-slate-400",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-400",
      textColor: "text-sky-700",
   },
};
