"use client";
import React, { useState, useMemo, useCallback } from "react";
import MobileLayout from "@/components/layout/mobile/MobileLayout";
import CalendarMonths from "@/components/ui/CalendarMonths";
import { useAttendanceByUser } from "@/hooks/useAttendance";
import { useAuth } from "@/context/AuthContext";
import { Attendance } from "@/types";
import AttendanceList from "@/components/ui/AttendanceList";
import AttendanceFilter from "@/components/ui/AttendanceFilter";
import AttendanceGrid from "@/components/ui/AttendanceGrid";
import ViewTypeToggle from "@/components/ui/ViewTypeToggle";
import getMonthStartAndEnd from "@/utils/getMonthStartAndEnd";
import NavigationButton from "@/components/ui/NavigationButton";
import { useRouter } from "next/navigation";
import SortToggle from "@/components/ui/SortToggle";

export default function Page() {
  const { user } = useAuth();
  const userId = user?.id;
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("semua");
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const goToRoute = (path: string) => () => router.push(path);

  const changeMonth = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const handlePrevMonth = () => changeMonth(-1);
  const handleNextMonth = () => changeMonth(1);

  // Attendance filter params for fetching
  const attendanceFilterParams = useMemo(() => {
    const { start, end } = getMonthStartAndEnd(currentDate);
    return {
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
      include: "details,status",
    };
  }, [currentDate]);

  const { userAttendances, isLoading: isLoadingAttendance } = useAttendanceByUser(
    userId,
    attendanceFilterParams
  );

  // Generate array of days in current month, sorted by sortOrder
  const daysInMonth = useMemo(() => {
    const { start, end } = getMonthStartAndEnd(currentDate);
    const days = [];
    let day = start.clone();
    while (day.isBefore(end) || day.isSame(end, "day")) {
      days.push(day.format("YYYY-MM-DD"));
      day = day.add(1, "day");
    }
    return sortOrder === "desc" ? days.reverse() : days;
  }, [currentDate, sortOrder]);

  const getAttendanceForDay = useCallback(
    (date: string) =>
      userAttendances?.data?.find((att: Attendance) => att.date === date),
    [userAttendances]
  );

  // Filter days based on filter state and viewType
  const filteredDays = useMemo(() => {
    if (viewType === "grid") {
      return daysInMonth;
    }

    return daysInMonth.filter((date) => {
      const attendance = getAttendanceForDay(date);

      if (filter === "semua") return true;

      const status = attendance?.attendanceStatus?.name;
      if (!status) return false;

      switch (filter) {
        case "hadir":
          return status === "Hadir";
        case "tidak_hadir":
          return status === "Tidak Hadir";
        case "lainnya":
          return status !== "Hadir" && status !== "Tidak Hadir";
        default:
          return false;
      }
    });
  }, [filter, daysInMonth, getAttendanceForDay, viewType]);

  return (
    <MobileLayout>
      {/* Header Section */}
      <div className="flex justify-between items-center z-[11] px-4 pt-6 pb-2">
        <NavigationButton direction="prev" onClick={goToRoute("/me/home")} />
        <div className="font-semibold text-xl flex-1 ml-4">Absensi</div>
        <NavigationButton direction="next" onClick={goToRoute("/me/leave")} />
      </div>

      <section className="mt-2 px-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Absensi Bulanan</div>
          <ViewTypeToggle viewType={viewType} setViewType={setViewType} />
        </div>
      </section>

      {/* Calendar Header */}
      <section className="mt-4 px-4">
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg">
          <CalendarMonths
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
      </section>

      {/* Attendance Filter */}
      <section className="mt-2 px-4 flex gap-2">
        {viewType === "list" && (
          <>
            <SortToggle sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <AttendanceFilter filter={filter} setFilter={setFilter} />
          </>
        )}
      </section>

      {/* Attendance List */}
      <section className="mt-2 px-4">
        {viewType === "list" && (
          <AttendanceList
            isLoadingAttendance={isLoadingAttendance}
            filteredDays={filteredDays}
            getAttendanceForDay={getAttendanceForDay}
          />
        )}
      </section>

      {/* Attendance Grid */}
      <section className="mt-2 px-4">
        {viewType === "grid" && (
          <AttendanceGrid
            isLoadingAttendance={isLoadingAttendance}
            filteredDays={filteredDays}
            getAttendanceForDay={getAttendanceForDay}
          />
        )}
      </section>
    </MobileLayout>
  );
}
