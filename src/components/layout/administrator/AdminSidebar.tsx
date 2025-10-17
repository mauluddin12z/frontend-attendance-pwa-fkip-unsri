import { usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import SidebarLink from "@/components/SidebarLink";
import LogoutModal from "@/components/ui/Modal/LogoutModal";
interface AdminSidebarProps {
   onLogout: () => void;
}

const sidebarLinks = [
   { href: "/administrator/dashboard", label: "Dashboard", icon: "HomeIcon" },
   { href: "/administrator/user", label: "User", icon: "UserIcon" },
   { href: "/administrator/absensi", label: "Absensi", icon: "AttendanceIcon" },
   { href: "/administrator/izin", label: "Izin", icon: "LeaveIcon" },
   {
      href: "/administrator/jam-kerja",
      label: "Jam kerja",
      icon: "WorkingHourIcon",
   },
   { href: "/administrator/libur", label: "Libur", icon: "HolidayIcon" },
   { href: "/administrator/lokasi", label: "Lokasi", icon: "LocationIcon" },
   { href: "/administrator/logs", label: "Logs", icon: "LogIcon" },
];

export default function AdminSidebar({
   onLogout,
}: Readonly<AdminSidebarProps>) {
   const pathname = usePathname();
   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

   const openLogoutModal = () => setIsLogoutModalOpen(true);
   const closeLogoutModal = () => setIsLogoutModalOpen(false);
   const confirmLogout = () => {
      onLogout();
      closeLogoutModal();
   };

   return (
      <aside className="fixed left-0 z-48 w-14 h-full bg-white border border-gray-200 sm:px-3 sm:py-4 px-1 py-2">
         <ul className="space-y-4 font-medium text-sm">
            {sidebarLinks.map(({ href, label, icon }) => {
               const isActive = pathname === href;
               return (
                  <SidebarLink
                     key={href}
                     href={href}
                     label={label}
                     icon={icon}
                     isActive={isActive}
                  />
               );
            })}
            <li className="relative group">
               <button
                  onClick={openLogoutModal}
                  className="flex flex-col justify-center items-center w-full gap-y-2 p-2 text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
                  aria-label="Logout"
               >
                  <FontAwesomeIcon icon={faSignOut} />
                  <div
                     className={`absolute top-0 -right-2 translate-x-full text-nowrap bg-white shadow-lg px-2.5 rounded-lg text-sm py-1 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
                  >
                     Logout
                  </div>
               </button>
            </li>
         </ul>

         {/* Logout Confirmation Modal */}
         {isLogoutModalOpen && (
            <LogoutModal
               isOpen={isLogoutModalOpen}
               closeModal={closeLogoutModal}
               onConfirm={confirmLogout}
            />
         )}
      </aside>
   );
}
