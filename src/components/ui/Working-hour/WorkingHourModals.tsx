import { ModalState } from "@/hooks/misc/useAdministratorModal";
import AddModal from "../Modal/AddModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";

import {
   UseFormHandleSubmit,
   UseFormRegister,
   UseFormWatch,
} from "react-hook-form";
import WorkingHourForm from "./WorkingHourForm";

interface WorkingHourModalsProps {
   modalState: ModalState;
   closeModal: () => void;
   handleDelete: () => void;
   handleSubmit: UseFormHandleSubmit<any>;
   handleEdit: (data: any) => void;
   handleAdd: (data: any) => void;
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   errors: any;
   register: UseFormRegister<any>;
   watch?: UseFormWatch<any>;
}

// Modals Component
const WorkingHourModals = ({
   modalState,
   closeModal,
   handleDelete,
   handleSubmit,
   handleEdit,
   handleAdd,
   isCreating,
   isUpdating,
   isDeleting,
   errors,
   register,
   watch,
}: WorkingHourModalsProps) => {
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
               modalTitle="Tambah Jam Kerja"
               isOpen={modalState.isAddModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleAdd)}
               isAdding={isCreating}
            >
               <WorkingHourForm
                  watch={watch!}
                  errors={errors}
                  register={register}
               />
            </AddModal>
         )}

         {modalState.isEditModalOpen && (
            <EditModal
               modalTitle="Edit Jam Kerja"
               isOpen={modalState.isEditModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleEdit)}
               isEditing={isUpdating}
            >
               <WorkingHourForm
                  watch={watch!}
                  errors={errors}
                  register={register}
               />
            </EditModal>
         )}
      </>
   );
};

export default WorkingHourModals;
