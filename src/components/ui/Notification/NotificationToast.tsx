"use client";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function NotificationToast() {
   const { notifications } = useNotifications();

   useEffect(() => {
      if (notifications.length === 0) return;
      const latest = notifications[0];
      toast(
         <div className="flex items-center">
            <div className="p-1 aspect-square rounded-full mr-4 bg-yellow-400">
               <FontAwesomeIcon className="text-white" icon={faBell} />
            </div>
            {latest.message}
         </div>
      );
   }, [notifications]);

   return null;
}
