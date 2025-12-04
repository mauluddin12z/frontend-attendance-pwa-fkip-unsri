import { User, UserForm } from "@/types";
import { mapJoiErrorsToForm } from "@/utils/mapJoiErrorToForm";
import toast from "react-hot-toast";
import { useCreateUser, useUpdateUser, useDeleteUser } from "./useUsers";

export default function useUserAction(
   mutate: () => void,
   closeModal: () => void,
   setError: any
) {
   const { createUser, isCreating } = useCreateUser();
   const { updateUser, isUpdating } = useUpdateUser();
   const { deleteUser, isDeleting } = useDeleteUser();

   const handleAction = async (
      action: "add" | "edit" | "delete",
      data?: UserForm,
      selectedUser?: User | null
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

      const toastId = toast.loading(`${actionMap[action]} pengguna...`);

      try {
         let formData = new FormData();

         // Handle data for add or edit actions
         if (action === "add" || action === "edit") {
            if (data) {
               const {
                  fullName,
                  nip,
                  email,
                  phoneNumber,
                  password,
                  confirmPassword,
                  roleId,
                  isActive,
                  deviceId
               } = data;

               formData = createFormData({
                  fullName,
                  nip,
                  email,
                  phoneNumber,
                  password,
                  confirmPassword,
                  roleId,
                  isActive,
                  deviceId,
               });
            } else {
               toast.error("Data pengguna tidak terdefinisi.", { id: toastId });
               return;
            }
         }

         // Perform the action
         switch (action) {
            case "add":
               await createUser(formData);
               break;
            case "edit":
               if (selectedUser?.id)
                  await updateUser(selectedUser.id, formData);
               break;
            case "delete":
               if (selectedUser?.id) await deleteUser(selectedUser.id);
               break;
            default:
               throw new Error("Tipe aksi tidak valid.");
         }

         mutate();
         closeModal();

         toast.success(`Data pengguna berhasil ${successMap[action]}.`, {
            id: toastId,
         });
      } catch (error: any) {
         handleError(error, toastId);
      }
   };

   // Helper to create FormData for user
   const createFormData = ({
      fullName,
      nip,
      email,
      phoneNumber,
      password,
      confirmPassword,
      roleId,
      isActive,
      deviceId,
   }: UserForm) => {
      const formData = new FormData();
      formData.append("fullName", fullName!);
      formData.append("nip", nip!);
      formData.append("email", email!);
      formData.append("phoneNumber", phoneNumber!);
      if (password) {
         formData.append("password", password!);
         formData.append("confirmPassword", confirmPassword!);
      }
      formData.append("roleId", roleId!);
      formData.append("isActive", isActive!);
      formData.append("deviceId", deviceId!);
      return formData;
   };

   // Error handling
   const handleError = (error: any, toastId: string) => {
      if (Array.isArray(error?.details)) {
         mapJoiErrorsToForm<UserForm>(error.details, setError, [
            "fullName",
            "nip",
            "email",
            "phoneNumber",
            "password",
            "roleId",
            "isActive",
            "deviceId",
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
