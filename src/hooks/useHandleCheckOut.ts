// hooks/useHandleCheckOut.ts
import { useUserCheckOut } from "@/hooks/useAttendanceDetail";
import toast from "react-hot-toast";

export function useHandleCheckOut(checkInData?: any, onSuccess?: () => void) {
   const { checkOut, isCheckingOut } = useUserCheckOut();

   const handleCheckOut = async () => {
      const toastId = toast.loading("Checking out...");

      let latitude: string = "";
      let longitude: string = "";

      try {
         const attendanceId = checkInData?.data?.[0]?.id;
         if (!attendanceId) throw new Error("No attendance ID found");

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
               toast.error(`Geolocation error: ${geoError}`, {
                  id: toastId,
               });
            }
         } else {
            toast.error("Geolocation is not supported by this browser.", {
               id: toastId,
            });
         }

         await checkOut({
            attendanceId,
            latitude,
            longitude,
         });

         toast.success("Checked out successfully!", { id: toastId });
         onSuccess?.();
      } catch (error: any) {
         console.error("Check-out failed:", error);
         toast.error(`Check-out failed: ${error.message}`, { id: toastId });
      }
   };

   return {
      handleCheckOut,
      isCheckingOut,
   };
}
