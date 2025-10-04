"use client";

import MobileLayout from "@/components/layout/mobile/MobileLayout";
import FormField from "@/components/ui/FormField";
import NavigationButton from "@/components/ui/NavigationButton";
import { useAuth } from "@/context/AuthContext";
import { useCreateLeaveRequest } from "@/hooks/useLeaveRequests";
import { LeaveRequestForm } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { SelectField } from "@/components/ui/SelectField";
import { TextareaField } from "@/components/ui/TextAreaField";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import HeaderTitle from "@/components/ui/HeaderTitle";

export default function Page() {
   const { user } = useAuth();
   const router = useRouter();
   const { createLeaveRequest } = useCreateLeaveRequest();

   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
      reset,
   } = useForm<LeaveRequestForm>({
      mode: "onTouched",
      defaultValues: {
         userId: "",
         startDate: "",
         endDate: "",
         leaveType: "",
         reason: "",
      },
   });

   useEffect(() => {
      if (user?.id !== undefined) {
         reset((formValues) => ({
            ...formValues,
            userId: String(user.id),
         }));
      }
   }, [user?.id, reset]);

   const onSubmit = async (data: LeaveRequestForm) => {
      const toastId = toast.loading("Mengajukan izin...");

      try {
         const formData = new FormData();
         formData.append("userId", data.userId);
         formData.append("startDate", data.startDate);
         formData.append("endDate", data.endDate);
         formData.append("leaveType", data.leaveType);
         formData.append("reason", data.reason);

         await createLeaveRequest(formData);

         toast.success("Pengajuan izin berhasil!", { id: toastId });
         router.push("/me/izin");
      } catch (error: any) {
         if (Array.isArray(error?.details)) {
            mapJoiErrorsToForm<LeaveRequestForm>(error.details, setError, [
               "startDate",
               "endDate",
               "leaveType",
               "reason",
            ]);
            toast.error("Mohon perbaiki kesalahan yang ditandai.", {
               id: toastId,
            });
         } else {
            const errorMessage =
               error?.message || "Gagal mengajukan izin. Silakan coba lagi.";
            toast.error(errorMessage, { id: toastId });
         }
      }
   };

   return (
      <MobileLayout>
         {/* Header */}
         <HeaderTitle
            title="Pengajuan Izin"
            showBackButton={true}
            navigateTo="/me/izin"
            className="px-4 pt-6 mb-6"
         />

         {/* Form */}
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-4 pt-4 pb-10"
            noValidate
         >
            <FormField
               label="Dari Tanggal"
               type="date"
               error={errors.startDate?.message}
               register={register("startDate")}
            />

            <FormField
               label="Sampai Tanggal"
               type="date"
               error={errors.endDate?.message}
               register={register("endDate")}
            />

            <SelectField
               label="Jenis Izin"
               error={errors.leaveType?.message}
               register={register("leaveType")}
               options={[
                  { value: "Sakit", label: "Sakit" },
                  { value: "Cuti Tahunan", label: "Cuti Tahunan" },
                  { value: "Cuti Melahirkan", label: "Cuti Melahirkan" },
                  { value: "Cuti Menikah", label: "Cuti Menikah" },
                  { value: "Izin Keluarga", label: "Izin Keluarga" },
                  { value: "Lainnya", label: "Lainnya" },
               ]}
            />

            <TextareaField
               label="Alasan"
               error={errors.reason?.message}
               register={register("reason")}
               placeholder="Masukkan alasan Anda..."
            />

            <button
               type="submit"
               disabled={isSubmitting}
               className="bg-blue-400 text-white py-2 rounded-lg mt-2 hover:bg-blue-600 transition"
            >
               {isSubmitting ? "Mengajukan..." : "Ajukan Izin"}
            </button>
         </form>
      </MobileLayout>
   );
}
