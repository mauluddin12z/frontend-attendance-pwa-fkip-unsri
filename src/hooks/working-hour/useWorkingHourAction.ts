import { WorkingHour, WorkingHourForm } from "@/types";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import toast from "react-hot-toast";
import {
   useCreateWorkingHour,
   useDeleteWorkingHour,
   useUpdateWorkingHour,
} from "./useWorkingHours";
import customMoment from "@/utils/customMoment";

export default function useWorkingHourAction(
   mutate: () => void,
   closeModal: () => void,
   setError: any
) {
   const { createWorkingHour, isCreating } = useCreateWorkingHour();
   const { updateWorkingHour, isUpdating } = useUpdateWorkingHour();
   const { deleteWorkingHour, isDeleting } = useDeleteWorkingHour();

   const handleAction = async (
      action: "add" | "edit" | "delete",
      data?: WorkingHourForm,
      selectedWorkingHour?: WorkingHour | null
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

      const toastId = toast.loading(`${actionMap[action]} Jam kerja...`);

      try {
         let formData = new FormData();

         // Handle data for add or edit actions
         if (action === "add" || action === "edit") {
            if (data) {
               const {
                  dayOfWeek,
                  startTime,
                  endTime,
                  gracePeriodMinutes,
                  isActive,
               } = data;

               formData = createFormData({
                  dayOfWeek,
                  startTime,
                  endTime,
                  gracePeriodMinutes,
                  isActive,
               });
            } else {
               toast.error("Data jam kerja tidak terdefinisi.", {
                  id: toastId,
               });
               return;
            }
         }

         // Perform the action
         switch (action) {
            case "add":
               await createWorkingHour(formData);
               break;
            case "edit":
               if (selectedWorkingHour?.id)
                  await updateWorkingHour(selectedWorkingHour.id, formData);
               break;
            case "delete":
               if (selectedWorkingHour?.id)
                  await deleteWorkingHour(selectedWorkingHour.id);
               break;
            default:
               throw new Error("Tipe aksi tidak valid.");
         }

         mutate();
         closeModal();

         toast.success(`Data Jam kerja berhasil ${successMap[action]}.`, {
            id: toastId,
         });
      } catch (error: any) {
         handleError(error, toastId);
      }
   };

   // Helper to create FormData
   const createFormData = ({
      dayOfWeek,
      startTime,
      endTime,
      gracePeriodMinutes,
      isActive,
   }: WorkingHourForm) => {
      const formData = new FormData();

      // Normalize times to HH:mm
      const formatTime = (time: string) => {
         return customMoment(time, ["HH:mm:ss", "HH:mm"]).format("HH:mm");
      };

      formData.append("dayOfWeek", dayOfWeek!);
      formData.append("startTime", formatTime(startTime!));
      formData.append("endTime", formatTime(endTime!));
      formData.append("gracePeriodMinutes", gracePeriodMinutes!);
      formData.append("isActive", isActive!);

      return formData;
   };
   // Error handling
   const handleError = (error: any, toastId: string) => {
      if (Array.isArray(error?.details)) {
         mapJoiErrorsToForm<WorkingHourForm>(error.details, setError, [
            "dayOfWeek",
            "startTime",
            "endTime",
            "gracePeriodMinutes",
            "isActive",
         ]);
         toast.error("Mohon perbaiki kesalahan yang ditandai.", {
            id: toastId,
         });
      } else {
         toast.error(error?.message || "Gagal memproses data pengguna.", {
            id: toastId,
         });
      }
   };

   return { handleAction, isCreating, isUpdating, isDeleting };
}
