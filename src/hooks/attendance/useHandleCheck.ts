import toast from "react-hot-toast";
import { getGeolocation } from "../misc/useGeolocation";
import { useState } from "react";

interface UseHandleCheckParams<T> {
   action: (params: T) => Promise<void>;
   getParams: () => T | Promise<T>;
   loadingMessage: string;
   successMessage: string;
   permissionMessage: string;
   onSuccess?: () => void;
   errorNoDataMessage?: string;
}

export function useHandleCheck<T>({
   action,
   getParams,
   loadingMessage,
   successMessage,
   permissionMessage,
   onSuccess,
   errorNoDataMessage,
}: UseHandleCheckParams<T>) {
   const [isLoading, setIsLoading] = useState(false);

   const handleCheck = async () => {
      const toastId = toast.loading(loadingMessage, { duration: 5000 });

      try {
         const position = await getGeolocation();

         const coords = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
         };

         const params = await getParams();

         if (errorNoDataMessage && !params) {
            throw new Error(errorNoDataMessage);
         }

         // Merge coords into params (assuming params is an object)
         const finalParams = { ...params, ...coords };

         setIsLoading(true);
         await action(finalParams);
         setIsLoading(false);

         toast.success(successMessage, { id: toastId });
         onSuccess?.();
      } catch (error: any) {
         setIsLoading(false);
         console.error("Check failed:", error);

         if (error.message.includes("denied")) {
            toast.error(
               "Anda menolak izin lokasi. Harap aktifkan layanan lokasi di pengaturan browser Anda.",
               { id: toastId }
            );
         } else if (error.message.includes("unavailable")) {
            toast.error(
               "Informasi lokasi tidak tersedia. Pastikan GPS/lokasi Anda aktif.",
               { id: toastId }
            );
         } else if (error.message.includes("timed out")) {
            toast.error(
               "Permintaan lokasi telah habis waktu. Coba lagi atau pindah ke area dengan sinyal GPS yang lebih baik.",
               { id: toastId }
            );
         } else if (
            errorNoDataMessage &&
            error.message.includes(errorNoDataMessage)
         ) {
            toast.error(errorNoDataMessage, { id: toastId });
         } else {
            toast.error(`Proses gagal: ${error.message}`, { id: toastId });
         }
      }
   };

   return {
      handleCheck,
      isLoading,
   };
}
