import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@/assets/NavigationIcon/HomeIcon";
import AttendanceIcon from "@/assets/NavigationIcon/AttendanceIcon";
import LeaveIcon from "@/assets/NavigationIcon/LeaveIcon";
import UserIcon from "@/assets/NavigationIcon/UserIcon";


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
         label: "Absensi",
         path: "/me/absensi",
      },
      {
         icon: LeaveIcon,
         label: "Izin",
         path: "/me/izin",
      },
      {
         icon: UserIcon,
         label: "Profile",
         path: "/me/profile",
      },
   ];

   return (
      <div className="w-full h-20 gap-2 grid grid-cols-4 fixed bottom-0 left-0 right-0 shadow-md z-[98] bg-white border-t border-gray-100">
         {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            const color = isActive ? "blue-400" : "gray-600";

            return (
               <Link
                  href={item.path}
                  key={index}
                  className={`flex flex-col justify-center items-center p-2 bg-white hover:bg-gray-100 transition duration-200 ${
                     isActive
                        ? `text-${color} border-t-4 border-${color}`
                        : `text-${color}`
                  }`}
               >
                  <div className="w-6 h-6 mb-2">
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
