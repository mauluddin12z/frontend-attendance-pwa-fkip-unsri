import { useMarkNotificationAsRead } from "@/hooks/notification";
import customMoment from "@/utils/customMoment";
import React from "react";

export default function NotificationCard({
   type,
   time,
   message,
   isRead,
   onMarkAsRead,
}: {
   type: string;
   time: string;
   message: string;
   isRead: boolean;
   onMarkAsRead: () => void;
}) {
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
                     onClick={onMarkAsRead}
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
