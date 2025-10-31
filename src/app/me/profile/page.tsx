"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/app/loading";
import {
   faEdit,
   faSignOut,
   faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoutModal from "@/components/ui/Modal/LogoutModal";
import ProfileInfo from "@/components/ui/Profile/ProfileInfo";

export default function Page() {
   const {
      user,
      isLoading: userLoading,
      handleLogout,
      isLoading: logoutLoading,
   } = useAuth();

   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

   const openLogoutModal = () => setIsLogoutModalOpen(true);
   const closeLogoutModal = () => setIsLogoutModalOpen(false);

   const confirmLogout = () => {
      handleLogout();
      closeLogoutModal();
   };

   if (userLoading) return <Loading />;

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-gray-50 to-white flex flex-col py-8 px-6 sm:px-8">
         {/* Profile Card */}
         <section className="bg-white shadow-sm rounded-xl p-6 space-y-6 border border-gray-200">
            <div className="flex flex-col items-center text-center space-y-3">
               <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
               </div>
               <h2 className="text-xl font-semibold text-gray-900">
                  {user?.fullName}
               </h2>
               <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-4">
               <ProfileInfo label="NIP" value={user?.nip} />
               <ProfileInfo
                  label="Nomor Telepon"
                  value={user?.phoneNumber || "---"}
               />
               <ProfileInfo label="Role" value={user?.role} />
            </div>
         </section>

         {/* Actions */}
         <section className="mt-8 space-y-4">
            {user?.role === "admin" && (
               <Link
                  href="/administrator/dashboard"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-yellow-100 text-yellow-700 font-medium py-3 px-4 rounded-lg hover:bg-yellow-200 transition-all duration-200"
               >
                  <FontAwesomeIcon icon={faUserShield} />
                  <span>Halaman Administrator</span>
               </Link>
            )}

            <Link
               href="/me/profile/update-profile"
               className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg hover:bg-blue-200 transition-all duration-200"
            >
               <FontAwesomeIcon icon={faEdit} />
               <span>Perbarui Akun</span>
            </Link>

            <button
               onClick={openLogoutModal}
               className={`flex items-center justify-center gap-2 w-full sm:w-auto font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                  logoutLoading
                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                     : "bg-red-100 text-red-600 hover:bg-red-200"
               }`}
               disabled={logoutLoading}
            >
               <FontAwesomeIcon icon={faSignOut} />
               <span>{logoutLoading ? "Sedang Keluar..." : "Logout"}</span>
            </button>
         </section>

         {/* Logout Confirmation Modal */}
         {isLogoutModalOpen && (
            <LogoutModal
               isOpen={isLogoutModalOpen}
               closeModal={closeLogoutModal}
               onConfirm={confirmLogout}
            />
         )}
      </div>
   );
}
