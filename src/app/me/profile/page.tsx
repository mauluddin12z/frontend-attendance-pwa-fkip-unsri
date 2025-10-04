"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import MobileLayout from "@/components/layout/mobile/MobileLayout";
import Modal from "@/components/ui/Modal";
import ProfileInfo from "@/components/ui/Profile/ProfileInfo";
import Loading from "@/app/loading";
import { faEdit, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeaderTitle from "@/components/ui/HeaderTitle";

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
      return (
         <MobileLayout>
            <Loading />
         </MobileLayout>
      );
   }

   return (
      <>
         <MobileLayout>
            {/* Header */}
            <HeaderTitle title="Profile" className="px-4 pt-6" />

            {/* Profile Data */}
            <section className="mt-4 px-4">
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
            <section className="mt-10 px-4">
               <div className="flex flex-col space-y-2">
                  <Link
                     href="/me/profile/update-profile"
                     className="w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                     aria-label="Update your profile"
                  >
                     <FontAwesomeIcon icon={faEdit} />
                     <span className="ml-2">Perbarui Akun</span>
                  </Link>
                  <button
                     onClick={openLogoutModal}
                     className={`w-full text-center px-4 py-2 flex items-center justify-center gap-2 text-white rounded-lg transition ${
                        logoutLoading
                           ? "bg-gray-400 cursor-not-allowed"
                           : "bg-red-500 hover:bg-red-600"
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
         </MobileLayout>

         {/* Logout Confirmation Modal */}
         <Modal
            isOpen={isLogoutModalOpen}
            closeModal={closeLogoutModal}
            isFooter={true}
            footer={
               <div className="flex justify-end space-x-4 pt-2">
                  <button
                     onClick={closeLogoutModal}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                     Batal
                  </button>
                  <button
                     onClick={confirmLogout}
                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                     Logout
                  </button>
               </div>
            }
         >
            <p className="text-sm text-gray-800">
               Apakah Anda yakin ingin logout?
            </p>
         </Modal>
      </>
   );
}
