// hooks/useHandleCheckOut.ts
import { useUserCheckOut } from "@/hooks/useAttendanceDetail";
import toast from "react-hot-toast";

export function useHandleCheckOut(checkInData?: any, onSuccess?: () => void) {
   const { checkOut, isCheckingOut } = useUserCheckOut();

   const handleCheckOut = async () => {
      const toastId = toast.loading("Checking out...");
      try {
         const attendanceId = checkInData?.data?.[0]?.id;
         if (!attendanceId) return;

         await checkOut({
            attendanceId,
            latitude: "-2.9581962225474805",
            longitude: "104.75689349",
         });
         toast.success("Checked out successfully!", { id: toastId });
         onSuccess?.();
      } catch (error) {
         console.error("Check-out failed:", error);
         toast.error("Failed to check out", { id: toastId });
      }
   };

   return {
      handleCheckOut,
      isCheckingOut,
   };
}
