import { useMemo } from "react";
import { useAttendanceByUser } from "./useAttendances";

interface AttendanceSummary {
   all: number;
   hadir: number;
   terlambat: number;
   pulangAwal: number;
   terlambatPulangAwal: number;
   tidakAdaCheckIn: number;
   tidakAdaCheckOut: number;
   izin: number;
   tidakHadir: number;
   libur: number;
}

export function useAttendanceSummaryCounts(
   slug: number,
   baseFilter: any
): { summary: AttendanceSummary; isLoading: boolean; mutateAll: () => void } {
   const { startDate, endDate } = baseFilter;

   const dateFilter = { startDate, endDate };

   // Main query
   const all = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
   });

   // Queries per status
   const hadirQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "hadir",
   });

   const terlambatQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "terlambat",
   });

   const pulangAwalQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "pulang awal",
   });

   const terlambatPulangAwalQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "terlambat & pulang awal",
   });

   const tidakAdaCheckInQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "tidak ada check-in",
   });

   const tidakAdaCheckOutQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "tidak ada check-out",
   });

   const izinQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "izin",
   });

   const tidakHadirQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "tidak hadir",
   });

   const liburQuery = useAttendanceByUser(slug, {
      ...dateFilter,
      include: "status, user",
      attendanceStatus: "libur",
   });

   // Combine loading states
   const isLoading =
      all.isLoading ||
      hadirQuery.isLoading ||
      terlambatQuery.isLoading ||
      pulangAwalQuery.isLoading ||
      terlambatPulangAwalQuery.isLoading ||
      tidakAdaCheckInQuery.isLoading ||
      tidakAdaCheckOutQuery.isLoading ||
      izinQuery.isLoading ||
      tidakHadirQuery.isLoading ||
      liburQuery.isLoading;

   // Summary calculation
   const summary = useMemo(
      () => ({
         all: all.userAttendances?.pagination?.totalItems ?? 0,
         hadir: hadirQuery.userAttendances?.pagination?.totalItems ?? 0,
         terlambat: terlambatQuery.userAttendances?.pagination?.totalItems ?? 0,
         pulangAwal:
            pulangAwalQuery.userAttendances?.pagination?.totalItems ?? 0,
         terlambatPulangAwal:
            terlambatPulangAwalQuery.userAttendances?.pagination?.totalItems ??
            0,
         tidakAdaCheckIn:
            tidakAdaCheckInQuery.userAttendances?.pagination?.totalItems ?? 0,
         tidakAdaCheckOut:
            tidakAdaCheckOutQuery.userAttendances?.pagination?.totalItems ?? 0,
         izin: izinQuery.userAttendances?.pagination?.totalItems ?? 0,
         tidakHadir:
            tidakHadirQuery.userAttendances?.pagination?.totalItems ?? 0,
         libur: liburQuery.userAttendances?.pagination?.totalItems ?? 0,
      }),
      [
         all.userAttendances?.pagination?.totalItems,
         hadirQuery.userAttendances?.pagination?.totalItems,
         terlambatQuery.userAttendances?.pagination?.totalItems,
         pulangAwalQuery.userAttendances?.pagination?.totalItems,
         terlambatPulangAwalQuery.userAttendances?.pagination?.totalItems,
         tidakAdaCheckInQuery.userAttendances?.pagination?.totalItems,
         tidakAdaCheckOutQuery.userAttendances?.pagination?.totalItems,
         izinQuery.userAttendances?.pagination?.totalItems,
         tidakHadirQuery.userAttendances?.pagination?.totalItems,
         liburQuery.userAttendances?.pagination?.totalItems,
      ]
   );

   // Refetch function
   const mutateAll = () => {
      all.mutate();
      hadirQuery.mutate();
      terlambatQuery.mutate();
      pulangAwalQuery.mutate();
      terlambatPulangAwalQuery.mutate();
      tidakAdaCheckInQuery.mutate();
      tidakAdaCheckOutQuery.mutate();
      izinQuery.mutate();
      tidakHadirQuery.mutate();
      liburQuery.mutate();
   };

   return { summary, isLoading, mutateAll };
}
