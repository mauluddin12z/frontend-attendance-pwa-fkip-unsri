import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@/assets/MobileNavigationIcon/homeIcon.js";
import AttendanceIcon from "@/assets/MobileNavigationIcon/attendanceIcon.js";
import LeaveIcon from "@/assets/MobileNavigationIcon/leaveIcon.js";
import UserIcon from "@/assets/MobileNavigationIcon/userIcon.js";

export default function BottomNavigationBar() {
   const pathname = usePathname();

   const navItems = [
      {
         icon: HomeIcon,
         label: "Home",
         path: "/me/home",
      },
      {
         icon: AttendanceIcon,
         label: "Attendance",
         path: "/me/attendance",
      },
      {
         icon: LeaveIcon,
         label: "Leave",
         path: "/me/leave",
      },
      {
         icon: UserIcon,
         label: "Profile",
         path: "/me/profile",
      },
   ];

   return (
      <div className="w-full h-20 gap-2 grid grid-cols-4 fixed bottom-0 left-0 right-0 shadow-md z-[98] bg-white">
         {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            const color = isActive ? "blue-400" : "gray-600";
            return (
               <Link
                  href={item.path}
                  key={index}
                  className={`flex flex-col justify-center items-center p-2 transition duration-200 ${
                     isActive
                        ? `text-${color} border-t-4 border-${color}`
                        : `text-${color}`
                  }`}
               >
                  {/* Pass dynamic color to the icon */}
                  <div className="w-6 h-6 mb-2">
                     {/* Dynamically pass color */}
                     <item.icon color={`${color}`} />
                  </div>
                  <span className={`text-xs text-center text-${color}`}>
                     {item.label}
                  </span>
               </Link>
            );
         })}
      </div>
   );
}
