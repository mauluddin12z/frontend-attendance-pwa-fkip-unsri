"use client";

import React, { useMemo, useCallback } from "react";
import SwipeToAction from "@/components/ui/Home/SwipeToAction";
import Calendar from "@/components/ui/Calendar/HorizontalCalendar";
import CheckInIcon from "@/assets/CheckInIcon";
import CheckOutIcon from "@/assets/CheckOutIcon";
import TimeIcon from "@/assets/TimeIcon";
import { useAuth } from "@/context/AuthContext";
import { useAttendanceByUser } from "@/hooks/attendance/useAttendances";
import { useHandleCheckIn } from "@/hooks/attendance/useHandleCheckIn";
import { useHandleCheckOut } from "@/hooks/attendance/useHandleCheckOut";
import { useWorkingHours } from "@/hooks/working-hour/useWorkingHours";
import { useSettingsGeofences } from "@/hooks/settings-geofence/useSettingsGeofences";
import { formatTime } from "@/utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import AttendanceCard from "@/components/ui/Home/AttendanceCard";
import LocationInfo from "@/components/ui/Home/LocationInfo";
import customMoment from "@/utils/customMoment";
import { useHolidays } from "@/hooks/holiday/useHolidays";
import { Holiday } from "@/types";

const Page = () => {
   // Common Values
   const today = useMemo(() => customMoment().format("YYYY-MM-DD"), []);
   const todayDayOfWeek = useMemo(() => customMoment().day(), []);

   // User
   const { user, isLoading: isLoadingUser } = useAuth();
   const userId = user?.id;

   // Holidays
   const { holidays } = useHolidays();
   const todayHoliday = useMemo(() => {
      if (!holidays?.data) return null;
      return (
         holidays.data.find((holiday: Holiday) => holiday.date === today) ||
         null
      );
   }, [holidays, today]);

   // Working Hours
   // Filter depends on day of week and skip if holiday
   const workingHourFilter = useMemo(() => {
      if (todayHoliday) return null;
      return { dayOfWeek: todayDayOfWeek };
   }, [todayHoliday, todayDayOfWeek]);

   const { workingHours, isLoading: isLoadingWorkingHours } =
      useWorkingHours(workingHourFilter);

   const todayWorkingHours = todayHoliday ? "Libur" : workingHours?.data?.[0];
   const hasWorkingHours = Boolean(
      todayWorkingHours && todayWorkingHours !== "Libur"
   );

   // Attendance
   // Factory for attendance filters
   const attendanceFilter = useCallback(
      (type?: string) => ({
         attendanceType: type,
         startDate: today,
         endDate: today,
         include: "details",
      }),
      [today]
   );

   // Check-in data
   const {
      userAttendances: checkInData,
      isLoading: isLoadingCheckIn,
      mutate: refetchCheckIn,
   } = useAttendanceByUser(userId, attendanceFilter("checkIn"));

   // Check-out data
   const {
      userAttendances: checkOutData,
      isLoading: isLoadingCheckOut,
      mutate: refetchCheckOut,
   } = useAttendanceByUser(userId, attendanceFilter("checkOut"));

   const hasCheckedIn = !!checkInData?.data?.[0]?.attendanceDetails?.length;
   const hasCheckedOut = !!checkOutData?.data?.[0]?.attendanceDetails?.length;

   const checkInTimestamp =
      checkInData?.data?.[0]?.attendanceDetails?.[0]?.timestamp;
   const checkOutTimestamp =
      checkOutData?.data?.[0]?.attendanceDetails?.[0]?.timestamp;

   // Handlers
   const { handleCheck: handleCheckIn, isLoading: isLoadingHandleCheckIn } =
      useHandleCheckIn(refetchCheckIn);
   const { handleCheck: handleCheckOut, isLoading: isLoadingHandleCheckOut } =
      useHandleCheckOut(checkInData, refetchCheckOut);

   const onCheckIn = useCallback(() => handleCheckIn(), [handleCheckIn]);
   const onCheckOut = useCallback(() => handleCheckOut(), [handleCheckOut]);

   // Geofence Settings
   const geofenceFilter = useMemo(() => ({ isActive: true }), []);
   const {
      settingsGeofences: activeSettingsGeofences,
      isLoading: isLoadingSettingsGeofence,
   } = useSettingsGeofences(geofenceFilter);

   return (
      <>
         {/* Top Section */}
         <div className="bg-blue-500 pb-12 flex flex-col relative z-[11] rounded-bl-lg rounded-br-lg">
            <div className="absolute w-64 aspect-square rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-blue-100/10 z-10 blur-3xl" />

            <section className="mb-2 z-[10] mt-2">
               <div className="flex justify-between px-4 pt-2.5 pb-2 h-20">
                  <LocationInfo
                     settingsGeofences={activeSettingsGeofences?.data}
                     isLoading={isLoadingSettingsGeofence}
                  />
                  <button
                     aria-label="Notifications"
                     className="text-white p-2 w-10 h-10 aspect-square rounded-lg bg-blue-300 hover:bg-blue-500 transition"
                     onClick={() => alert("Notification clicked!")}
                  >
                     <FontAwesomeIcon icon={faBell} size="lg" />
                  </button>
               </div>
            </section>

            <section className="ml-4 z-[10] h-full flex items-center">
               <h2 className="text-xl text-white flex flex-wrap gap-x-2">
                  <span className="font-semibold">
                     Selamat datang, <br />
                  </span>
                  <span className="font-normal text-wrap">
                     {isLoadingUser ? "______" : user?.fullName}
                  </span>
               </h2>
            </section>
         </div>

         {/* Main Content */}
         <div className="px-4 py-4 -mt-12 flex-1 z-[12]">
            {/* Calendar */}
            <section>
               <div className="bg-white px-4 py-4 rounded-2xl shadow border border-gray-200">
                  <Calendar isSelectable={false} />
               </div>
            </section>

            {/* Working Schedule */}
            <section className="mt-6">
               <div className="font-semibold mb-2">Jadwal Kerja Hari Ini</div>
               <div className="grid grid-cols-2 gap-2">
                  <AttendanceCard
                     icon={<TimeIcon />}
                     label="Check In"
                     time={todayWorkingHours?.startTime ?? todayWorkingHours}
                     description={todayHoliday?.description}
                     isLoading={isLoadingWorkingHours}
                  />
                  <AttendanceCard
                     icon={<TimeIcon />}
                     label="Check Out"
                     time={todayWorkingHours?.endTime ?? todayWorkingHours}
                     description={todayHoliday?.description}
                     isLoading={isLoadingWorkingHours}
                  />
               </div>
            </section>

            {/* Today's Attendance */}
            <section className="mt-6">
               <div className="font-semibold mb-2">Absensi Hari Ini</div>
               <div className="grid grid-cols-2 gap-2">
                  <AttendanceCard
                     icon={<CheckInIcon />}
                     label="Check In"
                     time={formatTime(checkInTimestamp)}
                     isLoading={isLoadingCheckIn}
                  />
                  <AttendanceCard
                     icon={<CheckOutIcon />}
                     label="Check Out"
                     time={formatTime(checkOutTimestamp)}
                     isLoading={isLoadingCheckOut}
                  />
               </div>
            </section>

            {/* Swipe to Action */}
            <section className="mt-6">
               {!hasCheckedIn && (
                  <SwipeToAction
                     onAction={onCheckIn}
                     type="checkin"
                     isActive={hasWorkingHours}
                     isLoading={isLoadingHandleCheckIn}
                  />
               )}
               {hasCheckedIn && !hasCheckedOut && (
                  <SwipeToAction
                     onAction={onCheckOut}
                     type="checkout"
                     isActive={hasWorkingHours}
                     isLoading={isLoadingHandleCheckOut}
                  />
               )}
            </section>
         </div>
      </>
   );
};

export default Page;
