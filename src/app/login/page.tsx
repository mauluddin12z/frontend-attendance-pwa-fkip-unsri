"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login } from "@/api/auth";
import toast from "react-hot-toast";
import LoadingButton from "@/components/ui/Loading/LoadingButton";
import LoginVector from "@/assets/LoginVector.svg";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import { Login } from "@/types";

export default function Page() {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
   } = useForm<Login>({ mode: "onTouched" });

   const [isSubmitting, setIsSubmitting] = useState(false);

   const onSubmit = async (data: Login) => {
      const toastId = toast.loading("Sedang login...");
      setIsSubmitting(true);

      try {
         await login(data.username, data.password);
         toast.success("Anda berhasil masuk ke akun Anda.", {
            id: toastId,
         });

         // Redirect to home (based on device)
         router.push(isMobile ? "/me/home" : "/administrator/dashboard");
      } catch (error: any) {
         if (Array.isArray(error?.details)) {
            mapJoiErrorsToForm(error.details, setError, [
               "username",
               "password",
            ]);
            toast.error("Mohon perbaiki kesalahan yang ditandai.", {
               id: toastId,
            });
         } else {
            const errorMessage =
               error?.message || "Login failed. Please try again.";
            toast.error(errorMessage, { id: toastId });
         }
      } finally {
         setIsSubmitting(false);
      }
   };
   return (
      <div className="w-full h-screen flex justify-center items-center relative overflow-hidden px-8 sm:px-3 bg-white">
         <div className="absolute w-96 aspect-square rounded-full bg-blue-600/10 top-0 left-0 translate-x-[-50%] translate-y-[-50%] blur-2xl z-10"></div>
         <div className="absolute w-96 aspect-square rounded-full bg-blue-400/10 bottom-0 right-0 translate-x-[50%] translate-y-[50%] blur-2xl z-10"></div>

         <div className="px-10 py-10 flex flex-col sm:flex-row sm:gap-10 justify-center items-center border border-gray-200 rounded-lg shadow-sm bg-white z-20">
            <div className="w-50 h-50 sm:w-72 sm:h-72 flex justify-center items-center">
               <LoginVector />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-3xs">
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 w-full"
               >
                  {/* Username */}
                  <div>
                     <label
                        htmlFor="username"
                        className="block text-sm/6 font-medium text-gray-900"
                     >
                        Username
                     </label>
                     <div className="mt-2">
                        <input
                           id="username"
                           type="text"
                           placeholder="Enter your username"
                           autoComplete="username"
                           {...register("username")}
                           className="block w-full rounded-md bg-gray-50 px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:bg-white focus:outline-2 focus:-outline-offset-2 focus:outline-blue-200 sm:text-sm/6"
                        />
                     </div>
                     {errors.username && (
                        <div className="text-xs text-red-600">
                           <p>{errors.username.message}</p>
                        </div>
                     )}
                  </div>

                  {/* Password */}
                  <div>
                     <label
                        htmlFor="password"
                        className="block text-sm/6 font-medium text-gray-900"
                     >
                        Password
                     </label>
                     <div className="mt-2">
                        <input
                           id="password"
                           type="password"
                           placeholder="Enter your password"
                           autoComplete="current-password"
                           {...register("password")}
                           className="block w-full rounded-md bg-gray-50 px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:bg-white focus:outline-2 focus:-outline-offset-2 focus:outline-blue-200 sm:text-sm/6"
                        />
                     </div>
                     {errors.password && (
                        <div className="text-xs text-red-600">
                           <p>{errors.password.message}</p>
                        </div>
                     )}
                  </div>

                  {/* Submit */}
                  <div className="mt-6">
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex w-full justify-center rounded-md bg-blue-400 px-4 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                           isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isSubmitting ? (
                           <LoadingButton label="Loading..." />
                        ) : (
                           "Sign In"
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
