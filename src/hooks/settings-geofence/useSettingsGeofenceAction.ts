import { LocationForm, Location } from "@/types";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import toast from "react-hot-toast";
import {
   useCreateSettingsGeofence,
   useDeleteSettingsGeofence,
   useUpdateSettingsGeofence,
} from "./useSettingsGeofences";

export default function useSettingsGeofenceAction(
   mutate: () => void,
   closeModal: () => void,
   setError: any
) {
   const { createSettingsGeofence, isCreating } = useCreateSettingsGeofence();
   const { updateSettingsGeofence, isUpdating } = useUpdateSettingsGeofence();
   const { deleteSettingsGeofence, isDeleting } = useDeleteSettingsGeofence();

   const handleAction = async (
      action: "add" | "edit" | "delete",
      data?: LocationForm,
      selectedLocation?: Location | null
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

      const toastId = toast.loading(`${actionMap[action]} lokasi...`);

      try {
         let formData = new FormData();

         // Prepare formData for add/edit
         if (action === "add" || action === "edit") {
            if (data) {
               const { name, latitude, longitude, radiusMeters, isActive } =
                  data;

               formData = createFormData({
                  name,
                  latitude,
                  longitude,
                  radiusMeters,
                  isActive,
               });
            } else {
               toast.error("Data lokasi tidak tersedia.", { id: toastId });
               return;
            }
         }

         // Execute action
         switch (action) {
            case "add":
               await createSettingsGeofence(formData);
               break;
            case "edit":
               if (selectedLocation?.id)
                  await updateSettingsGeofence(selectedLocation.id, formData);
               break;
            case "delete":
               if (selectedLocation?.id)
                  await deleteSettingsGeofence(selectedLocation.id);
               break;
            default:
               throw new Error("Aksi tidak valid.");
         }

         mutate();
         closeModal();

         toast.success(`Data lokasi berhasil ${successMap[action]}.`, {
            id: toastId,
         });
      } catch (error: any) {
         handleError(error, toastId);
      }
   };

   const createFormData = ({
      name,
      latitude,
      longitude,
      radiusMeters,
      isActive,
   }: LocationForm) => {
      const formData = new FormData();

      formData.append("name", name!);
      formData.append("latitude", latitude!.toString());
      formData.append("longitude", longitude!.toString());
      formData.append("radiusMeters", radiusMeters!.toString());
      formData.append("isActive", isActive!);

      return formData;
   };

   const handleError = (error: any, toastId: string) => {
      if (Array.isArray(error?.details)) {
         mapJoiErrorsToForm<LocationForm>(error.details, setError, [
            "name",
            "latitude",
            "longitude",
            "radiusMeters",
            "isActive",
         ]);
         toast.error("Mohon perbaiki kesalahan yang ditandai.", {
            id: toastId,
         });
      } else {
         toast.error(error?.message || "Terjadi kesalahan.", {
            id: toastId,
         });
      }
   };

   return { handleAction, isCreating, isUpdating, isDeleting };
}
