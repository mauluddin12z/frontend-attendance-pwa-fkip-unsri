// hooks/useHandleCheckIn.ts
import { useUserCheckIn } from "@/hooks/useAttendanceDetail";
import { useHandleCheck } from "./useHandleCheck";

export function useHandleCheckIn(onSuccess?: () => void) {
   const { checkIn } = useUserCheckIn();

   return useHandleCheck({
      action: checkIn,
      getParams: () => ({}),
      loadingMessage: "Checking in...",
      successMessage: "Checked in successfully!",
      permissionMessage:
         "This app needs your location to check you in. Please allow access to GPS/location services.",
      onSuccess,
   });
}
