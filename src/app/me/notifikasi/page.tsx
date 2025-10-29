"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import NotificationCard from "@/components/ui/Notification/NotificationCard";
import DeleteModal from "@/components/ui/Modal/DeleteModal";
import { useAuth } from "@/context/AuthContext";
import {
   useNotificationByUser,
   useDeleteAllNotifications,
} from "@/hooks/notification";
import { Notification } from "@/types";
import BounceLoading from "@/components/ui/Loading/BounceLoading";
import IconDeleteButton from "@/components/ui/IconDeleteButton";
import LoadingSpinner from "@/components/ui/Loading/LoadingSpinner";

export default function Page() {
   const { user, isLoading: userLoading } = useAuth();
   const userId = user?.id;

   // Pagination state
   const [page, setPage] = useState(1);
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [hasMore, setHasMore] = useState(false);

   const { userNotifications, isLoading, mutate } = useNotificationByUser(
      userId,
      {
         page,
         size: 10,
         sortBy: "createdAt",
         order: "DESC",
      }
   );

   const { deleteAllNotifications, isDeletingAll } =
      useDeleteAllNotifications();
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

   // Merge notifications as new pages load
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

   // Infinite scroll trigger
   const observerRef = useRef<HTMLDivElement | null>(null);

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
      setHasMore(true);
      mutate();
      setIsDeleteModalOpen(false);
   };

   const isDataLoading = userLoading || isLoading;

   return (
      <div className="bg-white min-h-[calc(100vh-5rem)] flex flex-col py-2">
         <div className="flex justify-between items-center px-4 pt-6">
            <HeaderTitle
               title="Notifikasi"
               showBackButton={true}
               backButtonBorderColor="border-white/0"
               navigateTo="/me/home"
            />
            <IconDeleteButton
               action={() => setIsDeleteModalOpen(true)}
               isAction={isDeletingAll || isDataLoading}
            />
         </div>

         <section className="pt-4 space-y-4 px-4 flex-1 overflow-auto">
            {page === 1 && isDataLoading ? (
               <LoadingSpinner />
            ) : notifications.length > 0 ? (
               <>
                  {notifications.map((notif: Notification) => (
                     <NotificationCard
                        key={notif.id}
                        notificationId={notif.id}
                        type={notif.type}
                        time={notif.createdAt}
                        message={notif.message}
                        isRead={notif.read}
                        mutate={mutate}
                     />
                  ))}

                  {/* Infinite scroll sentinel */}
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
               <p className="text-gray-500 text-center mt-4">
                  Belum ada notifikasi.
               </p>
            )}
         </section>

         <DeleteModal
            isOpen={isDeleteModalOpen}
            closeModal={() => setIsDeleteModalOpen(false)}
            isDeleting={isDeletingAll}
            onConfirm={handleConfirmDelete}
         />
      </div>
   );
}
