"use client";

import React, { useMemo } from "react";
import moment from "moment-timezone";
import MobileLayout from "@/components/layout/mobile/MobileLayout";
import SwipeToAction from "@/components/ui/SwipeToAction";
import Calendar from "@/components/ui/HorizontalCalendar";
import CheckInIcon from "@/assets/checkInIcon";
import CheckOutIcon from "@/assets/checkOutIcon";
import TimeIcon from "@/assets/timeIcon";
import { useAuth } from "@/context/AuthContext";
import { useAttendanceByUser } from "@/hooks/useAttendance";
import { useHandleCheckIn } from "@/hooks/useHandleCheckIn";
import { useHandleCheckOut } from "@/hooks/useHandleCheckOut";
import { useWorkingHours } from "@/hooks/useWorkingHour";
import { useSettingsGeofences } from "@/hooks/useSettingsGeofences";
import { formatTime } from "@/utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import AttendanceCard from "@/components/ui/AttendanceCard";
import ScheduledTimeCard from "@/components/ui/ScheduledTimeCard";
import LocationInfo from "@/components/ui/LocationInfo";
import { TIMEZONE } from "@/utils/constants";

const Page = () => {
   const today = useMemo(() => moment().tz(TIMEZONE).format("YYYY-MM-DD"), []);

   const { user, isLoading: isLoadingUser } = useAuth();
   const userId = user?.id;

   // Filters
   const workingHourFilter = useMemo(
      () => ({
         dayOfWeek: moment().tz(TIMEZONE).day(),
      }),
      []
   );

   const attendanceFilter = (type?: string) => ({
      attendanceType: type,
      startDate: today,
      endDate: today,
      include: "details",
   });

   const geofenceFilter = useMemo(() => ({ isActive: true }), []);

   // Data hooks
   const {
      userAttendances: checkInData,
      isLoading: isLoadingCheckIn,
      mutate: refetchCheckIn,
   } = useAttendanceByUser(userId, attendanceFilter("checkIn"));

   const {
      userAttendances: checkOutData,
      isLoading: isLoadingCheckOut,
      mutate: refetchCheckOut,
   } = useAttendanceByUser(userId, attendanceFilter("checkOut"));

   const { workingHours, isLoading: isLoadingWorkingHours } =
      useWorkingHours(workingHourFilter);
   const todayWorkingHours = workingHours?.data?.[0];
   const hasWorkingHours = Boolean(todayWorkingHours);

   const {
      settingsGeofences: activeSettingsGeofences,
      isLoading: isLoadingSettingsGeofence,
   } = useSettingsGeofences(geofenceFilter);

   const { handleCheck: handleCheckIn, isLoading: isLoadingHandleCheckIn } =
      useHandleCheckIn(refetchCheckIn);
   const { handleCheck: handleCheckOut, isLoading: isLoadingHandleCheckOut } =
      useHandleCheckOut(checkInData, refetchCheckOut);

   const hasCheckedIn = !!checkInData?.data?.[0]?.attendanceDetails?.length;
   const hasCheckedOut = !!checkOutData?.data?.[0]?.attendanceDetails?.length;

   const checkInTimestamp =
      checkInData?.data?.[0]?.attendanceDetails?.[0]?.timestamp;
   const checkOutTimestamp =
      checkOutData?.data?.[0]?.attendanceDetails?.[0]?.timestamp;

   return (
      <MobileLayout>
         {/* Top Section */}
         <div className="bg-blue-500 h-auto pb-12 flex flex-col relative z-[11] rounded-bl-lg rounded-br-lg">
            <div className="absolute w-64 aspect-square rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-blue-100/10 z-10 blur-3xl"></div>

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
                  <span className="font-normal">
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
                     time={todayWorkingHours?.startTime}
                     isLoading={isLoadingWorkingHours}
                  />
                  <AttendanceCard
                     icon={<TimeIcon />}
                     label="Check Out"
                     time={todayWorkingHours?.endTime}
                     isLoading={isLoadingWorkingHours}
                  />
               </div>
            </section>

            {/* Today Attendance */}
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
                     onAction={handleCheckIn}
                     type="checkin"
                     isActive={hasWorkingHours}
                     isLoading={isLoadingHandleCheckIn}
                  />
               )}
               {hasCheckedIn && (
                  <SwipeToAction
                     onAction={handleCheckOut}
                     type="checkout"
                     isActive={!hasCheckedOut && hasWorkingHours}
                     isLoading={isLoadingCheckOut}
                  />
               )}
            </section>
         </div>
      </MobileLayout>
   );
};

export default Page;
