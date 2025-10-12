import { Attendance, AttendanceForm } from "@/types";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import toast from "react-hot-toast";
import {
   useCreateAttendance,
   useDeleteAttendance,
   useUpdateAttendance,
} from "./useAttendances";

export default function useAttendanceAction(
   mutate: any,
   closeModal: any,
   setError: any
) {
   const { createAttendance, isCreating } = useCreateAttendance();
   const { updateAttendance, isUpdating } = useUpdateAttendance();
   const { deleteAttendance, isDeleting } = useDeleteAttendance();

   const handleAction = async (
      action: "add" | "edit" | "delete",
      data?: Attendance,
      selectedAttendance?: Attendance | null
   ) => {
      const actionMap = {
         add: "Menambahkan",
         edit: "Mengedit",
         delete: "Menghapus",
      };

      const successMap = {
         add: "ditambahkan",
         edit: "diedit",
         delete: "dihapus",
      };

      const toastId = toast.loading(`${actionMap[action]}...`);

      try {
         let formData = new FormData();

         // Handle data for add or edit actions
         if (action === "add" || action === "edit") {
            if (data) {
               console.log(data);
               const { userId, date, attendanceStatusId, notes } = data;
               formData = createFormData({
                  userId,
                  date,
                  attendanceStatusId,
                  notes,
               });
            } else {
               toast.error("Data absensi tidak terdefinisi.", { id: toastId });
               return;
            }
         }

         // Perform the action (add, edit, or delete)
         switch (action) {
            case "add":
               await createAttendance(formData);
               break;
            case "edit":
               if (selectedAttendance?.id)
                  await updateAttendance(selectedAttendance.id, formData);
               break;
            case "delete":
               if (selectedAttendance?.id)
                  await deleteAttendance(selectedAttendance.id);
               break;
            default:
               throw new Error("Invalid action type.");
         }

         // Refresh attendance data and close modal
         await mutate();
         closeModal();

         // Success toast
         toast.success(`Absensi berhasil ${successMap[action]}.`, {
            id: toastId,
         });
      } catch (error: any) {
         handleError(error, toastId);
      }
   };

   // Helper function to create form data
   const createFormData = ({
      userId,
      date,
      attendanceStatusId,
      notes,
   }: {
      userId: number;
      date: string;
      attendanceStatusId: number;
      notes: string;
   }) => {
      const formData = new FormData();
      formData.append("userId", userId.toString());
      formData.append("date", date);
      formData.append("attendanceStatusId", attendanceStatusId.toString());
      formData.append("notes", notes);
      return formData;
   };

   // Handle errors and map Joi validation errors to the form
   const handleError = (error: any, toastId: string) => {
      if (Array.isArray(error?.details)) {
         mapJoiErrorsToForm<AttendanceForm>(error.details, setError, [
            "date",
            "attendanceStatusId",
            "notes",
         ]);
         toast.error("Mohon perbaiki kesalahan yang ditandai.", {
            id: toastId,
         });
      } else {
         toast.error(
            error?.message || "Gagal mengedit data. Silakan coba lagi.",
            { id: toastId }
         );
      }
   };

   return { handleAction, isCreating, isUpdating, isDeleting };
}
