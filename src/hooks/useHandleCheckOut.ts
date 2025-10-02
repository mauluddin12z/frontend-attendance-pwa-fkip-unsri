// hooks/useHandleCheckOut.ts
import { useUserCheckOut } from "@/hooks/useAttendanceDetails";
import { useHandleCheck } from "./useHandleCheck";

export function useHandleCheckOut(checkInData?: any, onSuccess?: () => void) {
   const { checkOut } = useUserCheckOut();

   return useHandleCheck({
      action: checkOut,
      getParams: () => ({}),
      loadingMessage: "Checking out...",
      successMessage: "Checked out successfully!",
      permissionMessage:
         "This app needs your location to check you out. Please allow access to GPS/location services.",
      onSuccess,
      errorNoDataMessage: "Cannot check out: attendance record not found.",
   });
}
