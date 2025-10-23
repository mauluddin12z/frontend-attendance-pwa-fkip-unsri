import React from "react";

export default function NotificationCard({
   type,
   time,
   message,
}: {
   type: "checkin" | "checkout";
   time: string;
   message: string;
}) {
   return (
      <div className="p-4 bg-white border-b border-gray-200">
         <div className="flex items-center space-x-3">
            <div>
               <p className="text-xs text-gray-600">{time}</p>
               <p className="font-medium">
                  {type === "checkin" ? "Check In" : "Check Out"}
               </p>
               <p className="text-sm text-gray-600">{message}</p>
            </div>
         </div>
      </div>
   );
}
