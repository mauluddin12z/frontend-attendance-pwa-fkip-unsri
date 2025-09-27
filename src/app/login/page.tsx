"use client";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import { login } from "@/api/auth";
import LoadingButton from "@/components/ui/LoadingButton";
import toast from "react-hot-toast";
import LoginVector from "@/assets/LoginVector.svg";
import { isMobile } from "react-device-detect";

export default function Page() {
   const [username, setUsername] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [errors, setErrors] = useState<{
      message?: string;
      username?: string;
      password?: string;
   }>({});
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const toastId = toast.loading("Logging in...");
      setIsSubmitting(true);
      setErrors({}); // Reset previous errors early

      try {
         const response = await login(username, password);

         toast.success(
            response?.data?.message || "You are logged in successfully",
            { id: toastId }
         );
         // Redirect to a page that triggers middleware
         router.push(isMobile ? "/me/home" : "/home");
      } catch (error: any) {
         const newErrors: {
            username?: string;
            password?: string;
            message?: string;
         } = {};

         if (Array.isArray(error?.details)) {
            // Handle validation errors from API
            error.details.forEach((err: any) => {
               const path = err?.path?.join?.(".") || ""; // defensive fallback
               if (path.includes("username")) {
                  newErrors.username = err.message;
               } else if (path.includes("password")) {
                  newErrors.password = err.message;
               }
            });

            setErrors(newErrors);
            toast.error("Please fix the highlighted errors.", { id: toastId });
         } else {
            const errorMessage =
               error?.message || "Login failed. Please try again.";
            setErrors({ message: errorMessage });
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
         <div className="px-10 py-10 flex flex-col sm:flex-row sm:gap-10  justify-center items-center border border-gray-200 rounded-lg shadow-sm bg-white z-20">
            <div className="w-50 h-50 sm:w-72 sm:h-w-72 flex justify-center items-center">
               <LoginVector />
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-3xs b">
               <div className="my- h-4">
                  {/* Show error or success message */}
                  {errors.message && (
                     <div className="text-center text-base text-red-600 text-nowrap">
                        <p>{errors.message}</p>
                     </div>
                  )}
               </div>
               <form onSubmit={handleLogin} className="space-y-6 w-full">
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
                           name="username"
                           placeholder="Enter your username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           autoComplete="username"
                           className="block w-full rounded-md bg-gray-50 px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:bg-white focus:outline-2 focus:-outline-offset-2 focus:outline-blue-200 sm:text-sm/6"
                        />
                     </div>
                     {errors.username && (
                        <div className="text-xs text-red-600">
                           <p>{errors.username}</p>
                        </div>
                     )}
                  </div>

                  <div>
                     <div className="flex items-center justify-between">
                        <label
                           htmlFor="password"
                           className="block text-sm/6 font-medium text-gray-900"
                        >
                           Password
                        </label>
                     </div>
                     <div className="mt-2">
                        <input
                           id="password"
                           type="password"
                           name="password"
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           autoComplete="current-password"
                           className="block w-full rounded-md bg-gray-50 px-4 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:bg-white focus:outline-2 focus:-outline-offset-2 focus:outline-blue-200 sm:text-sm/6"
                        />
                     </div>
                     {errors.password && (
                        <div className="text-xs text-red-600">
                           <p>{errors.password}</p>
                        </div>
                     )}
                  </div>

                  <div className="mt-6">
                     <button
                        type="submit"
                        className={`flex w-full justify-center rounded-md bg-blue-400 px-4 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                           isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                        }`}
                     >
                        {isSubmitting ? (
                           <div className="flex gap-2 justify-center items-center">
                              <LoadingButton /> Loading...
                           </div>
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
