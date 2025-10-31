"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import NotificationCard from "@/components/ui/Notification/NotificationCard";
import DeleteModal from "@/components/ui/Modal/DeleteModal";
import { useAuth } from "@/context/AuthContext";
import {
   useNotificationByUser,
   useDeleteAllNotifications,
   useMarkAllNotificationsAsRead,
   useMarkNotificationAsRead,
} from "@/hooks/notification";
import { Notification } from "@/types";
import BounceLoading from "@/components/ui/Loading/BounceLoading";
import IconDeleteButton from "@/components/ui/IconDeleteButton";
import LoadingSpinner from "@/components/ui/Loading/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheckCircle, faRotate } from "@fortawesome/free-solid-svg-icons";

export default function NotificationPage() {
   const { user, isLoading: userLoading } = useAuth();
   const userId = user?.id;

   const [page, setPage] = useState(1);
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [hasMore, setHasMore] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [filter, setFilter] = useState<"all" | "unread">("all");

   const { userNotifications, isLoading, mutate } = useNotificationByUser(
      userId,
      {
         page,
         size: 10,
         sortBy: "createdAt",
         order: "DESC",
         ...(filter === "unread" && { isRead: false }),
      }
   );

   const { deleteAllNotifications, isDeletingAll } =
      useDeleteAllNotifications();
   const { markAllNotificationsAsRead, isMarkingAll } =
      useMarkAllNotificationsAsRead();
   const { markNotificationAsRead } = useMarkNotificationAsRead();

   const observerRef = useRef<HTMLDivElement | null>(null);

   // Merge new pages of notifications
   useEffect(() => {
      if (!userNotifications?.data) return;
      setNotifications((prev) => {
         if (page === 1) return userNotifications.data;
         const newItems = userNotifications.data.filter(
            (n: Notification) => !prev.some((p) => p.id === n.id)
         );
         return [...prev, ...newItems];
      });
      setHasMore(userNotifications.pagination?.hasNextPage ?? false);
   }, [userNotifications]);

   // Infinite scroll
   const handleObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
         const [target] = entries;
         if (target.isIntersecting && hasMore && !isLoading) {
            setPage((prev) => prev + 1);
         }
      },
      [hasMore, isLoading]
   );

   useEffect(() => {
      const observer = new IntersectionObserver(handleObserver, {
         root: null,
         rootMargin: "200px",
         threshold: 0,
      });
      if (observerRef.current) observer.observe(observerRef.current);
      return () => observer.disconnect();
   }, [handleObserver]);

   const handleConfirmDelete = async () => {
      await deleteAllNotifications();
      setPage(1);
      setNotifications([]);
      mutate();
      setIsDeleteModalOpen(false);
   };

   const handleMarkAsRead = async (notificationId: number) => {
      try {
         await markNotificationAsRead(notificationId);
         mutate();
      } catch (error) {
         console.error("Failed to mark notification as read:", error);
      }
   };

   const handleMarkAllAsRead = async () => {
      await markAllNotificationsAsRead();
      mutate();
   };

   const handleRefresh = () => {
      setPage(1);
      mutate();
   };

   const isDataLoading = userLoading || isLoading;
   const filteredNotifications =
      filter === "unread"
         ? notifications.filter((n) => !n.read)
         : notifications;

   return (
      <div className="bg-white min-h-[calc(100vh-5rem)] flex flex-col py-2">
         {/* Header */}
         <div className="flex justify-between items-center px-4 pt-6">
            <HeaderTitle
               title="Notifikasi"
               showBackButton={true}
               backButtonBorderColor="border-white/0"
               navigateTo="/me/home"
            />
            <div className="flex gap-2">
               <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-600 hover:text-black"
                  disabled={isDataLoading}
                  title="Refresh"
               >
                  <FontAwesomeIcon icon={faRotate} className="w-5 h-5" />
               </button>
               <button
                  onClick={handleMarkAllAsRead}
                  className="p-2 text-gray-600 hover:text-black"
                  disabled={isMarkingAll || isDataLoading}
                  title="Tandai semua dibaca"
               >
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
               </button>
               <IconDeleteButton
                  action={() => setIsDeleteModalOpen(true)}
                  isAction={isDeletingAll || isDataLoading}
               />
            </div>
         </div>

         {/* Filter Tabs */}
         <div className="flex gap-4 px-4 pt-2 text-sm font-medium border-b border-gray-400">
            <button
               className={`pb-2 ${
                  filter === "all"
                     ? "border-b-2 border-black text-black"
                     : "text-gray-500"
               }`}
               onClick={() => setFilter("all")}
            >
               Semua
            </button>
            <button
               className={`pb-2 ${
                  filter === "unread"
                     ? "border-b-2 border-black text-black"
                     : "text-gray-500"
               }`}
               onClick={() => setFilter("unread")}
            >
               Belum dibaca
            </button>
         </div>

         {/* Content */}
         <section className="pt-4 space-y-4 px-4 flex-1 overflow-auto">
            {page === 1 && isDataLoading ? (
               <LoadingSpinner />
            ) : filteredNotifications.length > 0 ? (
               <>
                  {filteredNotifications.map((notif: Notification) => (
                     <NotificationCard
                        key={notif.id}
                        type={notif.type}
                        time={notif.createdAt}
                        message={notif.message}
                        isRead={notif.read}
                        onMarkAsRead={() => handleMarkAsRead(notif.id)}
                     />
                  ))}
                  {hasMore && (
                     <div
                        ref={observerRef}
                        className="text-center py-2 text-gray-400"
                     >
                        <BounceLoading />
                     </div>
                  )}
               </>
            ) : (
               <div className="text-center text-gray-500 mt-8 flex flex-col items-center">
                  <FontAwesomeIcon
                     icon={faBell}
                     className="w-10 h-10 mb-2 text-gray-400"
                  />
                  <p>Tidak ada notifikasi.</p>
               </div>
            )}
         </section>

         {/* Delete Confirmation Modal */}
         <DeleteModal
            isOpen={isDeleteModalOpen}
            closeModal={() => setIsDeleteModalOpen(false)}
            isDeleting={isDeletingAll}
            onConfirm={handleConfirmDelete}
         />
      </div>
   );
}
