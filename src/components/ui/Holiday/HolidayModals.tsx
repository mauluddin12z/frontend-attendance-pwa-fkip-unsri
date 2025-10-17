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
import { Holiday } from "@/types"; // Make sure you have this type defined
import HolidayForm from "./HolidayForm";

interface HolidayModalsProps {
   modalState: ModalState;
   closeModal: () => void;
   handleDelete: () => void;
   handleSubmit: UseFormHandleSubmit<any>;
   handleEdit: (data: any) => void;
   handleAdd: (data: any) => void;
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   selectedHoliday?: Holiday;
   errors: any;
   register: UseFormRegister<any>;
   watch?: UseFormWatch<any>;
   control: Control<any>;
}

const HolidayModals = ({
   modalState,
   closeModal,
   handleDelete,
   handleSubmit,
   handleEdit,
   handleAdd,
   isCreating,
   isUpdating,
   isDeleting,
   selectedHoliday,
   errors,
   register,
   watch,
   control,
}: HolidayModalsProps) => {
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
               modalTitle="Tambah Liburan"
               isOpen={modalState.isAddModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleAdd)}
               isAdding={isCreating}
            >
               <HolidayForm errors={errors} register={register} />
            </AddModal>
         )}

         {modalState.isEditModalOpen && (
            <EditModal
               modalTitle="Edit Liburan"
               isOpen={modalState.isEditModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleEdit)}
               isEditing={isUpdating}
            >
               <HolidayForm errors={errors} register={register} />
            </EditModal>
         )}
      </>
   );
};

export default HolidayModals;
