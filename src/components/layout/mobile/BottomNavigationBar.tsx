import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@/assets/MobileNavigationIcon/homeIcon.js";
import AttendanceIcon from "@/assets/MobileNavigationIcon/attendanceIcon.js";
import LeaveIcon from "@/assets/MobileNavigationIcon/leaveIcon.js";
import UserIcon from "@/assets/MobileNavigationIcon/userIcon.js";
import { useAuth } from "@/context/AuthContext";

export default function BottomNavigationBar() {
   const pathname = usePathname();
   const [isProfileOpen, setIsProfileOpen] = useState(false);
   const profileRef = useRef<HTMLDivElement>(null);

   // Close profile dropdown when clicking outside of it
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            profileRef.current &&
            !profileRef.current.contains(event.target as Node)
         ) {
            setIsProfileOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const navItems = [
      {
         icon: HomeIcon,
         label: "Home",
         path: "/me/home",
      },
      {
         icon: AttendanceIcon,
         label: "Kehadiran",
         path: "/me/kehadiran",
      },
      {
         icon: LeaveIcon,
         label: "Cuti",
         path: "/me/cuti",
      },
   ];

   const { handleLogout } = useAuth();

   return (
      <div className="w-full h-20 gap-2 grid grid-cols-4 fixed bottom-0 left-0 right-0 shadow-md z-[98] bg-white border-t border-gray-100">
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
                  <div className="w-6 h-6 mb-2">
                     <item.icon color={`${color}`} />
                  </div>
                  <span className={`text-xs text-center text-${color}`}>
                     {item.label}
                  </span>
               </Link>
            );
         })}

         {/* Profile section */}
         <div
            ref={profileRef}
            className="relative flex flex-col justify-center items-center p-2 cursor-pointer"
         >
            <button
               onClick={() => setIsProfileOpen((prev) => !prev)}
               className="flex flex-col justify-center items-center p-2 transition duration-200 text-gray-600"
               type="button"
               aria-haspopup="true"
               aria-expanded={isProfileOpen}
               aria-controls="profile-menu"
            >
               <div className="w-6 h-6 mb-2">
                  <UserIcon color="gray-600" />
               </div>
               <span className="text-xs text-center text-gray-600">Profil</span>
            </button>

            {isProfileOpen && (
               <div
                  id="profile-menu"
                  className="absolute bottom-full mb-2 w-40 bg-white border border-gray-200 rounded-md py-1 z-50"
                  role="menu"
                  aria-label="Profile options"
               >
                  <button
                     className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                     role="menuitem"
                     type="button"
                  >
                     Perbarui Akun
                  </button>
                  <button
                     onClick={() => handleLogout()}
                     className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                     role="menuitem"
                     type="button"
                  >
                     Keluar
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
