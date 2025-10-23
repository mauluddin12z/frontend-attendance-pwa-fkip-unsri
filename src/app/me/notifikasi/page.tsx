"use client";

import HeaderTitle from "@/components/ui/HeaderTitle";
import NotificationCard from "@/components/ui/NotificationCard";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useWorkingHours } from "@/hooks/working-hour";
import { useAttendanceByUser } from "@/hooks/attendance";
import customMoment from "@/utils/customMoment";
import { useAuth } from "@/context/AuthContext";
import {
   requestNotificationPermission,
   showNotification,
} from "@/utils/notification";
import DeleteModal from "@/components/ui/Modal/DeleteModal";

// Types
type AppNotification = {
   id: string;
   type: "checkin" | "checkout";
   time: string; // HH:mm
   message: string;
   createdAt: string; // ISO string
};

const STORAGE_KEY = "app_notifications";

export default function Page() {
   const today = useMemo(() => customMoment().format("YYYY-MM-DD"), []);
   const todayDayOfWeek = useMemo(() => customMoment().day(), []);

   const [notifications, setNotifications] = useState<AppNotification[]>([]);

   // Working hours
   const { workingHours } = useWorkingHours({ dayOfWeek: todayDayOfWeek });
   const todayWorkingHours = workingHours?.data?.[0];

   // User
   const { user } = useAuth();
   const userId = user?.id;

   // Attendance filters
   const attendanceFilter = useCallback(
      (type?: string) => ({
         attendanceType: type,
         startDate: today,
         endDate: today,
         include: "details",
      }),
      [today]
   );

   const { userAttendances: checkInData } = useAttendanceByUser(
      userId,
      attendanceFilter("checkIn")
   );
   const { userAttendances: checkOutData } = useAttendanceByUser(
      userId,
      attendanceFilter("checkOut")
   );

   const hasCheckedIn = !!checkInData?.data?.[0]?.attendanceDetails?.length;
   const hasCheckedOut = !!checkOutData?.data?.[0]?.attendanceDetails?.length;

   // Load stored notifications
   useEffect(() => {
      try {
         const stored = localStorage.getItem(STORAGE_KEY);
         if (stored) {
            const parsed = JSON.parse(stored) as AppNotification[];
            setNotifications(parsed);
         }
      } catch (e) {
         console.error("Failed to load notifications from localStorage", e);
         localStorage.removeItem(STORAGE_KEY);
      }
   }, []);

   // Request notification permission on component mount
   useEffect(() => {
      requestNotificationPermission();
   }, []);

   // Schedule notifications
   useEffect(() => {
      if (!todayWorkingHours) return;

      const scheduleNotification = (
         type: "checkin" | "checkout",
         time: string,
         message: string
      ): (() => void) | undefined => {
         const [hour, minute] = time.split(":").map(Number);
         const now = new Date();
         const targetTime = new Date();
         targetTime.setHours(18, 27, 0, 0);

         const delay = targetTime.getTime() - now.getTime();
         if (delay <= 0) return; // already passed

         const timerId = setTimeout(() => {
            const newNotif: AppNotification = {
               id: `${type}-${Date.now()}`,
               type,
               time,
               message,
               createdAt: new Date().toISOString(),
            };

            const existing = JSON.parse(
               localStorage.getItem(STORAGE_KEY) || "[]"
            ) as AppNotification[];

            const updated = [...existing, newNotif];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setNotifications(updated);

            // Show the browser notification
            showNotification("Reminder", { body: message });
         }, delay);

         return () => clearTimeout(timerId); // Clean up
      };

      const timers: (() => void)[] = [];

      // Schedule check-in notification
      if (!hasCheckedIn && todayWorkingHours.startTime) {
         const checkinTimer = scheduleNotification(
            "checkin",
            todayWorkingHours.startTime,
            `Sudah waktunya check-in (${todayWorkingHours.startTime})`
         );
         if (checkinTimer) timers.push(checkinTimer);
      }
      // Schedule check-out notification
      if (!hasCheckedOut && todayWorkingHours.endTime) {
         const checkoutTimer = scheduleNotification(
            "checkout",
            todayWorkingHours.endTime,
            `Sudah waktunya check-out (${todayWorkingHours.endTime})`
         );
         if (checkoutTimer) timers.push(checkoutTimer);
      }

      // Cleanup timers when the component unmounts or when dependencies change
      return () => {
         timers.forEach((clear) => {
            if (clear) clear();
         });
      };
   }, [todayWorkingHours, hasCheckedIn, hasCheckedOut]);

   // Clear all notifications
   const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const clearAllNotifications = () => {
      setIsDeleteModalOpen((prev) => !prev);
      localStorage.removeItem(STORAGE_KEY);
      setNotifications([]);
   };

   return (
      <div className="bg-white min-h-[calc(100vh-5rem)] flex flex-col py-2">
         <div className="flex justify-between items-center px-4 pt-6">
            <HeaderTitle
               title="Notifikasi"
               showBackButton={true}
               navigateTo="/me/home"
            />
            <button
               onClick={() => setIsDeleteModalOpen((prev) => !prev)}
               className="flex justify-center items-center text-sm text-red-500 underline p-2 rounded border border-red-600 hover:bg-red-200 focus:bg-red-200 cursor-pointer"
            >
               <FontAwesomeIcon icon={faTrash} />
            </button>
         </div>

         <section className="pt-4 space-y-4 px-4">
            {notifications.length > 0 ? (
               notifications
                  .sort(
                     (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                  )
                  .map((notif) => (
                     <NotificationCard
                        key={notif.id}
                        type={notif.type}
                        time={notif.time}
                        message={notif.message}
                     />
                  ))
            ) : (
               <p className="text-gray-500">Belum ada notifikasi.</p>
            )}
         </section>
         <DeleteModal
            isOpen={IsDeleteModalOpen}
            closeModal={() => setIsDeleteModalOpen(false)}
            isDeleting={false}
            onConfirm={clearAllNotifications}
         />
      </div>
   );
}
