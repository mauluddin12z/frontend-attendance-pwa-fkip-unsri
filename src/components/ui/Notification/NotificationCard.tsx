import { useMarkNotificationAsRead } from "@/hooks/notification";
import customMoment from "@/utils/customMoment";
import React from "react";

export default function NotificationCard({
   notificationId,
   type,
   time,
   message,
   isRead,
   mutate,
}: {
   notificationId: number;
   type: string;
   time: string;
   message: string;
   isRead: boolean;
   mutate: () => void;
}) {
   const { markNotificationAsRead } = useMarkNotificationAsRead();

   const handleMarkAsRead = async () => {
      try {
         await markNotificationAsRead(notificationId);
         mutate();
      } catch (error) {
         console.error("Failed to mark notification as read:", error);
      }
   };

   return (
      <div
         className={`p-4 bg-white border-b border-gray-200 ${
            isRead && "opacity-40"
         }`}
      >
         <div className="flex items-center space-x-3">
            <div className="flex flex-col w-full">
               <p className="text-xs text-gray-600">
                  {customMoment(time).format("DD MMMM YYYY, HH:mm")}
               </p>
               <p className="font-medium">{type}</p>
               <p className="text-sm text-gray-600">{message}</p>
               <div className="flex justify-end">
                  <button
                     onClick={handleMarkAsRead}
                     className={`text-xs p-1.5 border border-blue-400 text-blue-400 ${
                        !isRead &&
                        "hover:bg-blue-400 hover:text-black cursor-pointer"
                     } transition-all`}
                     disabled={isRead}
                  >
                     Mark as read
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
