import { ModalState } from "@/hooks/misc/useAdministratorModal";
import AddModal from "../Modal/AddModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";
import Modal from "../Modal/Modal";
import AttendanceForm from "./AttendanceForm";
import AttendanceListCard from "./AttendanceListCard";
import {
   Control,
   FieldErrors,
   UseFormHandleSubmit,
   UseFormRegister,
   UseFormSetValue,
   UseFormWatch,
} from "react-hook-form";
import { Attendance, AttendanceStatus, User } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface AttendanceModalsProps {
   modalState: ModalState;
   closeModal: () => void;
   handleDelete: () => void;
   handleSubmit: UseFormHandleSubmit<any>;
   handleEdit: (data: any) => void;
   handleAdd: (data: any) => void;
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   selectedAttendance?: Attendance;
   users: User[];
   userLoading: boolean;
   setSearchUser: Dispatch<SetStateAction<string>>;
   errors: FieldErrors;
   register: UseFormRegister<any>;
   control: Control<any>;
   watch?: UseFormWatch<any>;
   selectedUser?: User;
}

// Modals Component
const AttendanceModals = ({
   modalState,
   closeModal,
   handleDelete,
   handleSubmit,
   handleEdit,
   handleAdd,
   isCreating,
   isUpdating,
   isDeleting,
   selectedAttendance,
   users,
   userLoading,
   setSearchUser,
   errors,
   register,
   control,
   watch,
   selectedUser,
}: AttendanceModalsProps) => {
   return (
      <>
         {/* Modal */}
         {modalState.isDetailModalOpen && (
            <Modal
               isOpen={modalState.isDetailModalOpen}
               closeModal={closeModal}
               modalTitle="Detail Absensi"
               isFooter={false}
               width="max-w-[calc(100%-24px)]"
            >
               <AttendanceListCard
                  day={selectedAttendance?.date!}
                  attendance={selectedAttendance}
               />
            </Modal>
         )}
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
               modalTitle="Tambah Absensi"
               isOpen={modalState.isAddModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleAdd)}
               isAdding={isCreating}
            >
               <AttendanceForm
                  register={register}
                  control={control}
                  watch={watch}
                  errors={errors}
                  users={users}
                  userLoading={userLoading}
                  setSearchUser={setSearchUser}
                  selectedUser={selectedUser}
               />
            </AddModal>
         )}

         {modalState.isEditModalOpen && (
            <EditModal
               modalTitle="Edit Absensi"
               isOpen={modalState.isEditModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleEdit)}
               isEditing={isUpdating}
            >
               <AttendanceForm
                  register={register}
                  control={control}
                  errors={errors}
                  watch={watch}
                  selectedUser={selectedUser}
               />
            </EditModal>
         )}
      </>
   );
};

export default AttendanceModals;
