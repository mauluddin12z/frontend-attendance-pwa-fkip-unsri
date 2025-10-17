import { ModalState } from "@/hooks/misc/useAdministratorModal";
import AddModal from "../Modal/AddModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";

import {
   Control,
   UseFormHandleSubmit,
   UseFormRegister,
   UseFormWatch,
} from "react-hook-form";
import { Role, User } from "@/types";
import UserForm from "./UserForm";

interface UserModalsProps {
   modalState: ModalState;
   closeModal: () => void;
   handleDelete: () => void;
   handleSubmit: UseFormHandleSubmit<any>;
   handleEdit: (data: any) => void;
   handleAdd: (data: any) => void;
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   selectedUser?: User;
   roles: Role[];
   roleLoading: boolean;
   errors: any;
   register: UseFormRegister<any>;
   watch?: UseFormWatch<any>;
   control: Control<any>;
}

// Modals Component
const UserModals = ({
   modalState,
   closeModal,
   handleDelete,
   handleSubmit,
   handleEdit,
   handleAdd,
   isCreating,
   isUpdating,
   isDeleting,
   selectedUser,
   roles,
   roleLoading,
   errors,
   register,
   watch,
   control,
}: UserModalsProps) => {
   return (
      <>
         {modalState.isDeleteModalOpen && (
            <DeleteModal
               isOpen={modalState.isDeleteModalOpen}
               closeModal={closeModal}
               onConfirm={handleDelete}
               isDeleting={isDeleting}
            />
         )}

         {modalState.isAddModalOpen && (
            <AddModal
               modalTitle="Tambah User"
               isOpen={modalState.isAddModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleAdd)}
               isAdding={isCreating}
            >
               <UserForm
                  formType="add"
                  control={control}
                  watch={watch!}
                  errors={errors}
                  register={register}
                  roleLoading={roleLoading}
                  roles={roles}
               />
            </AddModal>
         )}

         {modalState.isEditModalOpen && (
            <EditModal
               modalTitle="Edit Data User"
               isOpen={modalState.isEditModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleEdit)}
               isEditing={isUpdating}
            >
               <UserForm
                  formType="edit"
                  control={control}
                  watch={watch!}
                  errors={errors}
                  register={register}
                  roleLoading={roleLoading}
                  roles={roles}
               />
            </EditModal>
         )}
      </>
   );
};

export default UserModals;
