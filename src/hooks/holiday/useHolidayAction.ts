import { Holiday, HolidayForm } from "@/types";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import toast from "react-hot-toast";
import {
   useCreateHoliday,
   useDeleteHoliday,
   useUpdateHoliday,
} from "./useHolidays";

export default function useHolidayAction(
   mutate: () => void,
   closeModal: () => void,
   setError: any
) {
   const { createHoliday, isCreating } = useCreateHoliday();
   const { updateHoliday, isUpdating } = useUpdateHoliday();
   const { deleteHoliday, isDeleting } = useDeleteHoliday();

   const handleAction = async (
      action: "add" | "edit" | "delete",
      data?: HolidayForm,
      selectedHoliday?: Holiday | null
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

      const toastId = toast.loading(`${actionMap[action]} data libur...`);

      try {
         let formData = new FormData();

         if (action === "add" || action === "edit") {
            if (data) {
               const { name, date, description } = data;

               formData = createFormData({ name, date, description });
            } else {
               toast.error("Data liburan tidak terdefinisi.", {
                  id: toastId,
               });
               return;
            }
         }

         switch (action) {
            case "add":
               await createHoliday(formData);
               break;
            case "edit":
               if (selectedHoliday?.id)
                  await updateHoliday(selectedHoliday.id, formData);
               break;
            case "delete":
               if (selectedHoliday?.id) await deleteHoliday(selectedHoliday.id);
               break;
            default:
               throw new Error("Tipe aksi tidak valid.");
         }

         mutate();
         closeModal();

         toast.success(`Data liburan berhasil ${successMap[action]}.`, {
            id: toastId,
         });
      } catch (error: any) {
         handleError(error, toastId);
      }
   };

   // Helper to create FormData for holiday
   const createFormData = ({ name, date, description }: HolidayForm) => {
      const formData = new FormData();
      formData.append("name", name!);
      formData.append("date", date!);
      formData.append("description", description ?? "");
      return formData;
   };

   // Error handling
   const handleError = (error: any, toastId: string) => {
      if (Array.isArray(error?.details)) {
         mapJoiErrorsToForm<HolidayForm>(error.details, setError, [
            "name",
            "date",
            "description",
         ]);
         toast.error("Mohon perbaiki kesalahan yang ditandai.", {
            id: toastId,
         });
      } else {
         toast.error(error?.message || "Gagal memproses data liburan.", {
            id: toastId,
         });
      }
   };

   return { handleAction, isCreating, isUpdating, isDeleting };
}
