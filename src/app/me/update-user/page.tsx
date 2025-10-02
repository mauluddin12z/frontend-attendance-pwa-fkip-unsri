"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useUpdateUserProfile } from "@/hooks/useUsers";
import toast from "react-hot-toast";
import NavigationButton from "@/components/ui/NavigationButton";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import Modal from "@/components/ui/Modal";

type FormData = {
   fullName: string;
   currentPassword?: string;
   newPassword?: string;
   confirmPassword?: string;
};

export default function ProfilePage() {
   const { user, mutate: userMutate } = useAuth();
   const userId = user?.id;
   const router = useRouter();
   const { updateUser, isUpdating } = useUpdateUserProfile();

   const [success, setSuccess] = useState(false);
   const [changePassword, setChangePassword] = useState(false);
   const [currentPasswordErrMsg, setCurrentPasswordErrMsg] = useState("");

   // New state: control modal open/close
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

   const {
      register,
      watch,
      formState: { errors },
      reset,
      setValue,
      setError,
      getValues,
   } = useForm<FormData>({
      mode: "onTouched",
   });

   // Watch currentPassword to clear backend error message
   useEffect(() => {
      const subscription = watch((_, { name }) => {
         if (name === "currentPassword") {
            setCurrentPasswordErrMsg("");
         }
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   // Prefill form with user data
   useEffect(() => {
      if (user) {
         reset({
            fullName: user.fullName || "",
         });
      }
   }, [user, reset]);

   // On successful update reset and show toast
   useEffect(() => {
      if (success) {
         reset({
            fullName: user?.fullName || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
         });
         setChangePassword(false);
         toast.success("Profile updated successfully!");
         setSuccess(false);
      }
   }, [success, reset, user]);

   // This is the actual submit handler for updating user profile
   const onSubmit = async (data: FormData) => {
      const toastId = toast.loading("Updating profile...");
      if (!userId) return;

      const formData = new FormData();
      formData.append("fullName", data.fullName);

      if (
         changePassword &&
         data.currentPassword &&
         data.newPassword &&
         data.confirmPassword
      ) {
         formData.append("currentPassword", data.currentPassword);
         formData.append("newPassword", data.newPassword);
         formData.append("confirmPassword", data.confirmPassword);
      }

      try {
         await updateUser(userId, formData);
         userMutate();
         setSuccess(true);
         toast.dismiss(toastId);
         setIsUpdateModalOpen(false);
      } catch (error: any) {
         setSuccess(false);

         if (Array.isArray(error?.details)) {
            mapJoiErrorsToForm(error.details, setError, [
               "fullName",
               "currentPassword",
               "password",
               "confirmPassword",
            ]);
            toast.error("Mohon perbaiki kesalahan yang ditandai.", {
               id: toastId,
            });
         } else {
            const message = error?.message || "Failed to update profile.";
            if (message.toLowerCase().includes("current password")) {
               setCurrentPasswordErrMsg(message);
            }
            toast.error(message, { id: toastId });
         }
         setIsUpdateModalOpen(false);
      }
   };

   // Handle opening modal on form submit button click
   const handleOpenModal = () => {
      setIsUpdateModalOpen(true);
   };

   // Handle confirm button in modal, trigger actual form submit with current data
   const handleConfirmUpdate = () => {
      const data = getValues();
      onSubmit(data);
   };

   const closeUpdateModal = () => {
      setIsUpdateModalOpen(false);
   };

   return (
      <>
         <div className="max-w-md mx-auto mt-10 px-4">
            <div className="flex gap-x-2 mb-6 items-center">
               <NavigationButton
                  direction="prev"
                  onClick={() => router.push("/me/home")}
                  borderColor="border-white/0"
               />
               <h1 className="text-2xl font-semibold">Update Profile</h1>
            </div>

            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  handleOpenModal();
               }}
               className="space-y-5"
               noValidate
            >
               {/* Full Name */}
               <FormField
                  label="Full Name"
                  type="text"
                  error={errors.fullName?.message}
                  register={register("fullName")}
               />

               {/* Toggle password fields */}
               {!changePassword ? (
                  <button
                     type="button"
                     onClick={() => setChangePassword(true)}
                     className="text-sm text-blue-600 hover:underline"
                  >
                     Change Password?
                  </button>
               ) : (
                  <>
                     {/* Current Password */}
                     <FormField
                        label="Current Password"
                        type="password"
                        error={
                           errors.currentPassword?.message ||
                           currentPasswordErrMsg
                        }
                        register={register("currentPassword")}
                     />

                     {/* New Password */}
                     <FormField
                        label="New Password"
                        type="password"
                        error={errors.newPassword?.message}
                        register={register("newPassword")}
                     />

                     {/* Confirm Password */}
                     <FormField
                        label="Confirm Password"
                        type="password"
                        error={errors.confirmPassword?.message}
                        register={register("confirmPassword")}
                     />

                     {/* Cancel password change */}
                     <button
                        type="button"
                        onClick={() => {
                           setChangePassword(false);
                           setValue("currentPassword", "");
                           setValue("newPassword", "");
                           setValue("confirmPassword", "");
                        }}
                        className="text-sm text-gray-500 hover:underline"
                     >
                        Cancel password change
                     </button>
                  </>
               )}

               {/* Submit Button (opens modal) */}
               <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
               >
                  {isUpdating ? "Updating..." : "Update Profile"}
               </button>
            </form>
         </div>

         {/* Confirmation Modal */}
         <Modal
            isOpen={isUpdateModalOpen}
            closeModal={closeUpdateModal}
            isFooter={true}
            footer={
               <div className="flex justify-end space-x-4 pt-2">
                  <button
                     onClick={closeUpdateModal}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={handleConfirmUpdate}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                     Update
                  </button>
               </div>
            }
         >
            <p>Apakah anda yakin ingin mengubah profile anda?</p>
         </Modal>
      </>
   );
}
