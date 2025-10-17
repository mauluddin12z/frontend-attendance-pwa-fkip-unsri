import { ModalState } from "@/hooks/misc/useAdministratorModal";
import AddModal from "../Modal/AddModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";

import {
   UseFormHandleSubmit,
   UseFormRegister,
   UseFormWatch,
} from "react-hook-form";
import LocationForm from "./LocationForm";

interface LocationModalsProps {
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

const LocationModals = ({
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
}: LocationModalsProps) => {
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
               modalTitle="Tambah Lokasi"
               isOpen={modalState.isAddModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleAdd)}
               isAdding={isCreating}
            >
               <LocationForm
                  watch={watch!}
                  errors={errors}
                  register={register}
               />
            </AddModal>
         )}

         {modalState.isEditModalOpen && (
            <EditModal
               modalTitle="Edit Lokasi"
               isOpen={modalState.isEditModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleEdit)}
               isEditing={isUpdating}
            >
               <LocationForm
                  watch={watch!}
                  errors={errors}
                  register={register}
               />
            </EditModal>
         )}
      </>
   );
};

export default LocationModals;
