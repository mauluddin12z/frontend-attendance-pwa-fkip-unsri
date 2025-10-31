"use client";
import React, { useState, useMemo, useCallback } from "react";
import CalendarMonths from "@/components/ui/Calendar/CalendarMonths";
import { useAuth } from "@/context/AuthContext";
import { Attendance } from "@/types";
import AttendanceList from "@/components/ui/Attendance/AttendanceList";
import AttendanceFilter from "@/components/ui/Attendance/AttendanceFilter";
import AttendanceGrid from "@/components/ui/Attendance/AttendanceGrid";
import ViewTypeToggle from "@/components/ui/Attendance/ViewTypeToggle";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";
import SortToggle from "@/components/ui/Attendance/SortToggle";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { useAttendanceByUser } from "@/hooks/attendance";

export default function Page() {
   const { user } = useAuth();
   const userId = user?.id;

   const [currentDate, setCurrentDate] = useState(new Date());
   const [filter, setFilter] = useState<
      "semua" | "hadir" | "tidak_hadir" | "izin" | "lainnya"
   >("semua");
   const [viewType, setViewType] = useState<"list" | "grid">("list");
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

   // Change month handler
   const changeMonth = useCallback((offset: number) => {
      setCurrentDate((prev) => {
         const newDate = new Date(prev);
         newDate.setMonth(newDate.getMonth() + offset);
         return newDate;
      });
   }, []);

   // Attendance fetch params based on currentDate
   const attendanceFilterParams = useMemo(() => {
      const { start, end } = getMonthStartAndEnd(currentDate);
      return {
         startDate: start.format("YYYY-MM-DD"),
         endDate: end.format("YYYY-MM-DD"),
         include: "details,status",
         size: 31,
      };
   }, [currentDate]);

   // Fetch user attendance
   const { userAttendances, isLoading: isLoadingAttendance } =
      useAttendanceByUser(userId, attendanceFilterParams);

   // Generate days in current month sorted by sortOrder
   const daysInMonth = useMemo(() => {
      const { start, end } = getMonthStartAndEnd(currentDate);
      const days: string[] = [];
      let day = start.clone();
      while (day.isBefore(end) || day.isSame(end, "day")) {
         days.push(day.format("YYYY-MM-DD"));
         day = day.add(1, "day");
      }
      return sortOrder === "desc" ? days.reverse() : days;
   }, [currentDate, sortOrder]);

   // Memoized function to get attendance for a given day
   const getAttendanceForDay = useCallback(
      (date: string) =>
         userAttendances?.data?.find((att: Attendance) => att.date === date),
      [userAttendances]
   );

   // Filter days based on filter
   const filteredDays = useMemo(() => {
      if (filter === "semua") return daysInMonth;

      return daysInMonth.filter((date) => {
         const attendance = getAttendanceForDay(date);
         const status = attendance?.attendanceStatus?.name;

         if (!status) return false;

         switch (filter) {
            case "hadir":
               return status === "Hadir";
            case "tidak_hadir":
               return status === "Tidak Hadir";
            case "izin":
               return status === "Izin";
            case "lainnya":
               return status !== "Hadir" && status !== "Tidak Hadir";
            default:
               return false;
         }
      });
   }, [filter, daysInMonth, getAttendanceForDay]);

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-indigo-50 pb-10">
         {/* Header */}
         <section className="flex flex-col gap-x-2 pt-8 px-6">
            <div className="flex justify-between items-center">
               <HeaderTitle title="Absensi" />{" "}
               <ViewTypeToggle viewType={viewType} setViewType={setViewType} />
            </div>
            <p className="mt-4 text-sm text-gray-600">
               Pantau kehadiran Anda setiap hari dan kelola data absensi
               bulanan.
            </p>
         </section>

         {/* Main Content */}
         <section className="mt-4 px-4">
            <div className="rounded-2xl bg-white overflow-clip py-6 shadow-sm border border-gray-200">
               {/* Calendar Header */}
               <section className="px-4">
                  <div className="flex flex-col bg-white border border-gray-200 rounded-lg">
                     <CalendarMonths
                        currentDate={currentDate}
                        onPrevMonth={() => changeMonth(-1)}
                        onNextMonth={() => changeMonth(1)}
                     />
                  </div>
               </section>

               {/* Filters & Sorting (only for list view) */}
               {viewType === "list" && (
                  <section className="mt-4 px-4 flex gap-2">
                     <SortToggle
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                     />
                     <AttendanceFilter filter={filter} setFilter={setFilter} />
                  </section>
               )}

               {/* Attendance Display */}
               <section className="mt-4 px-4">
                  {viewType === "list" ? (
                     <AttendanceList
                        isLoadingAttendance={isLoadingAttendance}
                        filteredDays={filteredDays}
                        getAttendanceForDay={getAttendanceForDay}
                     />
                  ) : (
                     <AttendanceGrid
                        isLoadingAttendance={isLoadingAttendance}
                        getAttendanceForDay={getAttendanceForDay}
                        currentDate={currentDate}
                     />
                  )}
               </section>
            </div>
         </section>
      </div>
   );
}
