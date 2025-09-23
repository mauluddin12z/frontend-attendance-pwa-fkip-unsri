// hooks/useHandleCheckIn.ts
import { useUserCheckIn } from "@/hooks/useAttendanceDetail";
import toast from "react-hot-toast";

export function useHandleCheckIn(onSuccess?: () => void) {
   const { checkIn, isCheckingIn } = useUserCheckIn();

   const handleCheckIn = async () => {
      const toastId = toast.loading("Checking in...");

      let latitude: string = "";
      let longitude: string = "";

      try {
         if (navigator.geolocation) {
            try {
               const position = await new Promise<GeolocationPosition>(
                  (resolve, reject) => {
                     navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                     });
                  }
               );

               latitude = position.coords.latitude.toString();
               longitude = position.coords.longitude.toString();
            } catch (geoError) {
               console.warn("Geolocation error:", geoError);
               // Continue with null lat/lng
            }
         } else {
            toast.error("Geolocation is not supported by this browser.", {
               id: toastId,
            });
         }

         await checkIn({
            latitude,
            longitude,
         });

         toast.success("Checked in successfully!", { id: toastId });
         onSuccess?.();
      } catch (error: any) {
         console.error("Check-in failed:", error);
         toast.error(`Check-in failed: ${error.message}`, { id: toastId });
      }
   };

   return {
      handleCheckIn,
      isCheckingIn,
   };
}
