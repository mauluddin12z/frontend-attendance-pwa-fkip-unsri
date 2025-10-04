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
import HeaderTitle from "@/components/ui/HeaderTitle";

type FormData = {
   fullName: string;
   phoneNumber: string;
   currentPassword?: string;
   newPassword?: string;
   confirmPassword?: string;
};

export default function Page() {
   const { user, mutate: userMutate } = useAuth();
   const router = useRouter();
   const userId = user?.id;
   const { updateUser, isUpdating } = useUpdateUserProfile();

   const [showPasswordFields, setShowPasswordFields] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [customErrors, setCustomErrors] = useState({
      phoneNumber: "",
      currentPassword: "",
   });

   const {
      register,
      watch,
      formState: { errors },
      reset,
      setValue,
      setError,
      getValues,
   } = useForm<FormData>({ mode: "onTouched" });

   // Clear custom current password error on input change
   useEffect(() => {
      const subscription = watch((_, { name }) => {
         if (name === "currentPassword") {
            setCustomErrors((prev) => ({ ...prev, currentPassword: "" }));
         }
         if (name === "phoneNumber") {
            setCustomErrors((prev) => ({ ...prev, phoneNumber: "" }));
         }
      });
      return () => subscription.unsubscribe();
   }, [watch]);

   // Prefill form
   useEffect(() => {
      if (user) {
         reset({
            fullName: user.fullName || "",
            phoneNumber: user.phoneNumber || "",
         });
      }
   }, [user, reset]);

   const handleSubmit = async (form: FormData) => {
      if (!userId) return;

      const toastId = toast.loading("Updating profile...");

      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("phoneNumber", form.phoneNumber);

      if (showPasswordFields) {
         formData.append("currentPassword", form.currentPassword || "");
         formData.append("newPassword", form.newPassword || "");
         formData.append("confirmPassword", form.confirmPassword || "");
      }

      try {
         await updateUser(userId, formData);
         userMutate();
         toast.success("Profile updated successfully", { id: toastId });
         reset({
            fullName: form.fullName,
            phoneNumber: form.phoneNumber,
         });
         setShowPasswordFields(false);
         setIsModalOpen(false);
      } catch (error: any) {
         toast.dismiss(toastId);

         if (Array.isArray(error?.details)) {
            mapJoiErrorsToForm(error.details, setError, [
               "fullName",
               "phoneNumber",
               "currentPassword",
               "newPassword",
               "confirmPassword",
            ]);
            toast.error("Mohon perbaiki kesalahan yang ditandai.");
         } else {
            const message = error?.message || "Gagal memperbarui profil.";
            if (error?.errorType === "DuplicateError") {
               setCustomErrors((prev) => ({
                  ...prev,
                  phoneNumber: "Nomor Telepon ini sudah terdaftar",
               }));
            }
            if (message.toLowerCase().includes("current password")) {
               setCustomErrors((prev) => ({
                  ...prev,
                  currentPassword: message,
               }));
            }
            toast.error(message);
         }
      }
   };

   const handleConfirmUpdate = () => {
      const formData = getValues();
      handleSubmit(formData);
   };

   const handleCancelPasswordChange = () => {
      setShowPasswordFields(false);
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
   };

   return (
      <>
         <div className="max-w-md mx-auto px-4">
            <HeaderTitle
               title="Update Profile"
               showBackButton={true}
               navigateTo="/me/profile"
               className="pt-6 mb-6"
            />

            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
               }}
               className="space-y-5"
               noValidate
            >
               <FormField
                  label="Full Name"
                  type="text"
                  error={errors.fullName?.message}
                  register={register("fullName")}
               />

               <FormField
                  label="Nomor Telepon"
                  type="text"
                  error={
                     errors.phoneNumber?.message || customErrors.phoneNumber
                  }
                  register={register("phoneNumber")}
               />

               {!showPasswordFields ? (
                  <button
                     type="button"
                     onClick={() => setShowPasswordFields(true)}
                     className="text-sm text-blue-600 hover:underline"
                  >
                     Ubah password?
                  </button>
               ) : (
                  <>
                     <FormField
                        label="Current Password"
                        type="password"
                        error={
                           errors.currentPassword?.message ||
                           customErrors.currentPassword
                        }
                        register={register("currentPassword")}
                     />

                     <FormField
                        label="New Password"
                        type="password"
                        error={errors.newPassword?.message}
                        register={register("newPassword")}
                     />

                     <FormField
                        label="Confirm Password"
                        type="password"
                        error={errors.confirmPassword?.message}
                        register={register("confirmPassword")}
                     />

                     <button
                        type="button"
                        onClick={handleCancelPasswordChange}
                        className="text-sm text-gray-500 hover:underline"
                     >
                        Batalkan perubahan password
                     </button>
                  </>
               )}

               <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
               >
                  {isUpdating ? "Memperbarui..." : "Perbarui Profil"}
               </button>
            </form>
         </div>

         {/* Modal Konfirmasi */}
         <Modal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            isFooter
            footer={
               <div className="flex justify-end space-x-4 pt-2">
                  <button
                     onClick={() => setIsModalOpen(false)}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                     Batal
                  </button>
                  <button
                     onClick={handleConfirmUpdate}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                     Konfirmasi
                  </button>
               </div>
            }
         >
            <p className="text-gray-800 text-sm">
               Apakah Anda yakin ingin memperbarui profil Anda?
            </p>
         </Modal>
      </>
   );
}
