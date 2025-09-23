"use client";

import React, { useState } from "react";
import MobileLayout from "@/components/layout/mobile/MobileLayout";
import SwipeToAction from "@/components/ui/SwipeToAction";
import Calendar from "@/components/ui/HorizontalCalendar/Calendar";
import CheckInIcon from "@/assets/checkInIcon";
import CheckOutIcon from "@/assets/checkOutIcon";
import TimeIcon from "@/assets/timeIcon";
import { useAuth } from "@/context/AuthContext";
import { useAttendanceByUser } from "@/hooks/useAttendance";
import moment from "moment-timezone";
import AttendanceCard from "@/components/ui/AttendanceCard";
import { useHandleCheckIn } from "@/hooks/useHandleCheckIn";
import { useHandleCheckOut } from "@/hooks/useHandleCheckOut";
import { useWorkingHours } from "@/hooks/useWorkingHour";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import ScheduledTimeCard from "@/components/ui/ScheduledTimeCard";

const TIMEZONE = "Asia/Jakarta";
const today = moment().tz(TIMEZONE).format("YYYY-MM-DD");

const Page = () => {
   const { user, isLoading: isLoadingUser } = useAuth();
   const userId = user?.id;

   // Attendance filters
   const getAttendanceFilter = (type?: string) => ({
      attendanceType: type,
      startDate: today,
      endDate: today,
      include: "details",
   });

   // Working hour filters
   const getWorkingHourFilter = () => ({
      dayOfWeek: moment().tz("Asia/Jakarta").day(),
   });

   // Hooks
   const {
      userAttendances: checkInData,
      isLoading: isLoadingCheckIn,
      mutate: refetchCheckIn,
   } = useAttendanceByUser(userId, getAttendanceFilter("checkIn"));

   const {
      userAttendances: checkOutData,
      isLoading: isLoadingCheckOut,
      mutate: refetchCheckOut,
   } = useAttendanceByUser(userId, getAttendanceFilter("checkOut"));

   const { workingHours, isLoading: isLoadingWorkingHours } = useWorkingHours(
      getWorkingHourFilter()
   );

   const formatTime = (attendance: any) => {
      return attendance?.attendanceDetails?.length
         ? moment(attendance.attendanceDetails[0].timestamp).format("HH:mm:ss")
         : "---";
   };

   const { handleCheckIn, isCheckingIn } = useHandleCheckIn(
      userId,
      refetchCheckIn
   );
   const { handleCheckOut, isCheckingOut } = useHandleCheckOut(
      checkInData,
      refetchCheckOut
   );

   const hasCheckedIn = !!checkInData?.data?.[0]?.attendanceDetails?.length;
   const hasCheckedOut = !!checkOutData?.data?.[0]?.attendanceDetails?.length;

   return (
      <MobileLayout>
         {/* Top Section */}
         <div className="bg-blue-400 bg-gradient-to-bl from-blue-400 to-blue-500 h-44 flex flex-col flex-none relative z-[11]">
            <div className="absolute w-64 aspect-square rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-blue-100/10 z-10"></div>
            {/* Location and Notification */}
            <section className="mb-2 z-[10]">
               <div className="flex items-center justify-between rounded-lg px-4 pt-4 pb-2">
                  {/* Location Info */}
                  <div className="flex items-center space-x-4">
                     <div className="p-2 w-10 aspect-square bg-blue-300/20 text-white rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faLocationDot} size="lg" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-white font-light text-sm">
                           Location
                        </span>
                        <p className="text-white font-semibold text-sm">
                           Jl. Pelita Sekip Ujung Lr Damai 3
                        </p>
                     </div>
                  </div>

                  {/* Notification Button */}
                  <button
                     aria-label="Notifications"
                     className="text-white p-2 w-10 aspect-square rounded-full bg-blue-300/20 hover:bg-blue-500 transition"
                     onClick={() => alert("Notification clicked!")}
                  >
                     <FontAwesomeIcon icon={faBell} size="lg" />
                  </button>
               </div>
            </section>

            {/* User Info */}
            <section className="mb-2 ml-4 z-[10]">
               <h2 className="text-xl text-white text-nowrap">
                  <span className="font-semibold">
                     Welcome, <br />
                  </span>
                  <span className="font-normal">
                     {isLoadingUser ? (
                        <div className="w-36 rounded-md h-5 bg-blue-300 animate-pulse"></div>
                     ) : (
                        user?.fullName
                     )}
                  </span>
               </h2>
            </section>
         </div>

         {/* Content Section */}
         <div className="px-4 py-4 -mt-12 flex-1 z-[12]">
            <div className="bg-white px-4 py-4 rounded-2xl shadow border border-gray-200">
               {/* Calendar */}
               <section>
                  <Calendar isSelectable={false} />
               </section>
            </div>

            {/* Scheduled Hours */}
            <section className="mt-4">
               <div className="font-semibold mb-2">Working Time</div>
               <div className="grid grid-cols-2 gap-2">
                  {/* Check In */}
                  <ScheduledTimeCard
                     icon={<TimeIcon />}
                     label="Check In"
                     time={workingHours?.data[0]?.startTime}
                     isLoading={isLoadingWorkingHours}
                  />

                  {/* Check Out */}
                  <ScheduledTimeCard
                     icon={<TimeIcon />}
                     label="Check Out"
                     time={workingHours?.data[0]?.endTime}
                     isLoading={isLoadingWorkingHours}
                  />
               </div>
            </section>

            {/* Today Attendance */}
            <section className="mt-4">
               <div className="font-semibold mb-2">Today Attendance</div>
               <div className="grid grid-cols-2 gap-2">
                  {/* Check In */}
                  <AttendanceCard
                     icon={<CheckInIcon />}
                     label="Check In"
                     time={formatTime(checkInData?.data?.[0])}
                     isLoading={isLoadingCheckIn}
                  />

                  {/* Check Out */}
                  <AttendanceCard
                     icon={<CheckOutIcon />}
                     label="Check Out"
                     time={formatTime(checkOutData?.data?.[0])}
                     isLoading={isLoadingCheckOut}
                  />
               </div>
            </section>
            {/* Swipe Actions fixed at bottom */}
            <section className="mt-4">
               {!hasCheckedIn && (
                  <SwipeToAction
                     onAction={handleCheckIn}
                     type="checkin"
                     isActive
                     isLoading={isCheckingIn}
                  />
               )}
               {hasCheckedIn && (
                  <SwipeToAction
                     onAction={handleCheckOut}
                     type="checkout"
                     isActive={!hasCheckedOut}
                     isLoading={isCheckingOut}
                  />
               )}
            </section>
         </div>
      </MobileLayout>
   );
};

export default Page;
