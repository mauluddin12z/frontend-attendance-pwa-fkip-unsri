"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileInfo from "@/components/ui/Profile/ProfileInfo";
import Loading from "@/app/loading";
import { faEdit, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeaderTitle from "@/components/ui/HeaderTitle";
import LogoutModal from "@/components/ui/LogoutModal";

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

   if (userLoading) {
      return <Loading />;
   }

   return (
      <>
         {/* Header */}
         <HeaderTitle title="Profile" className="px-4 pt-6" />

         {/* Profile Data */}
         <section className="mt-4 px-4 bg-white">
            <div className="flex-col space-y-4">
               <ProfileInfo label="Nama" value={user?.fullName} />
               <ProfileInfo label="NIP" value={user?.nip} />
               <ProfileInfo label="Email" value={user?.email} />
               <ProfileInfo
                  label="Nomor Telepon"
                  value={user?.phoneNumber || "---"}
               />
               <ProfileInfo label="Role" value={user?.role} />
            </div>
         </section>

         {/* Actions */}
         <section className="mt-6 px-4">
            <div className="flex flex-col space-y-6">
               {user?.role === "admin" && (
                  <Link
                     href="/administrator/dashboard"
                     className="w-fit text-center text-yellow-500 rounded-lg hover:text-yellow-600 transition"
                     aria-label="Update your profile"
                  >
                     <FontAwesomeIcon icon={faEdit} />
                     <span className="ml-2">Administrator</span>
                  </Link>
               )}
               <Link
                  href="/me/profile/update-profile"
                  className="w-fit text-center text-blue-500 rounded-lg hover:text-blue-600 transition"
                  aria-label="Update your profile"
               >
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="ml-2">Perbarui Akun</span>
               </Link>
               <button
                  onClick={openLogoutModal}
                  className={`w-fit text-center flex items-center justify-center gap-2 rounded-lg transition ${
                     logoutLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-600"
                  }`}
                  role="menuitem"
                  type="button"
                  disabled={logoutLoading}
               >
                  <FontAwesomeIcon icon={faSignOut} />
                  <span>{logoutLoading ? "Logging Out..." : "Logout"}</span>
               </button>
            </div>
         </section>

         {/* Logout Confirmation Modal */}
         {isLogoutModalOpen && (
            <LogoutModal
               isOpen={isLogoutModalOpen}
               closeModal={closeLogoutModal}
               onConfirm={confirmLogout}
            />
         )}
      </>
   );
}
