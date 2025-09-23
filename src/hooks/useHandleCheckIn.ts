// hooks/useHandleCheckIn.ts
import { useUserCheckIn } from "@/hooks/useAttendanceDetail";
import {
   useCreateAttendance,
   useAttendanceByUser,
} from "@/hooks/useAttendance";
import moment from "moment-timezone";
import toast from "react-hot-toast";

const TIMEZONE = "Asia/Jakarta";
const today = moment().tz(TIMEZONE).format("YYYY-MM-DD");

export function useHandleCheckIn(userId?: number, onSuccess?: () => void) {
   const { checkIn, isCheckingIn } = useUserCheckIn();
   const { createAttendance, isCreating } = useCreateAttendance();
   const { userAttendances: allTodayAttendances } = useAttendanceByUser(
      userId,
      {
         startDate: today,
         endDate: today,
         include: "details",
      }
   );

   const createAttendanceIfNotExist = async () => {
      const existingId = allTodayAttendances?.[0]?.attendanceId;
      if (existingId) return existingId;

      const formData = new FormData();
      if (userId) formData.append("userId", userId.toString());
      formData.append("date", today);

      const newAttendance = await createAttendance(formData);
      return newAttendance?.data?.id;
   };

   const handleCheckIn = async () => {
      const toastId = toast.loading("Checking in...");
      try {
         const attendanceId = await createAttendanceIfNotExist();
         if (!attendanceId) return;

         await checkIn({
            attendanceId,
            latitude: "-2.9581962225474805",
            longitude: "104.75689349",
         });

         toast.success("Checked in successfully!", { id: toastId });
         onSuccess?.();
      } catch (error) {
         console.error("Check-in failed:", error);
         toast.error("Failed to check in", { id: toastId });
      }
   };

   return {
      handleCheckIn,
      isCheckingIn: isCheckingIn || isCreating,
   };
}
