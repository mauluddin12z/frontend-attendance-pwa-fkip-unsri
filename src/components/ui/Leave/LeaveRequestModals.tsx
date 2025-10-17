import { ModalState } from "@/hooks/misc/useAdministratorModal";
import AddModal from "../Modal/AddModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";
import Modal from "../Modal/Modal";
import {
   Control,
   FieldErrors,
   UseFormHandleSubmit,
   UseFormRegister,
   UseFormWatch,
} from "react-hook-form";
import { LeaveRequest, LeaveUser, User } from "@/types";
import { Dispatch, SetStateAction } from "react";
import LeaveForm from "./LeaveForm";
import ModalFooter from "../Modal/ModalFooter";
import { TextareaField } from "../Form/TextAreaField";

interface LeaveRequestModalsProps {
   modalState: ModalState;
   closeModal: () => void;
   handleDelete: () => void;
   handleSubmit: UseFormHandleSubmit<any>;
   handleEdit: (data: any) => void;
   handleAdd: (data: any) => void;
   handleApprove: (data: any) => void;
   handleReject: (data: any) => void;
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   isApproving: boolean;
   isRejecting: boolean;
   selectedLeaveRequest?: LeaveRequest;
   users: User[];
   userLoading: boolean;
   setSearchUser: Dispatch<SetStateAction<string>>;
   errors: FieldErrors;
   register: UseFormRegister<any>;
   control: Control<any>;
   watch?: UseFormWatch<any>;
   selectedUser?: LeaveUser;
}

// Modals Component
const LeaveRequestModals = ({
   modalState,
   closeModal,
   handleDelete,
   handleSubmit,
   handleEdit,
   handleAdd,
   handleApprove,
   handleReject,
   isCreating,
   isUpdating,
   isDeleting,
   isApproving,
   isRejecting,
   selectedLeaveRequest,
   users,
   userLoading,
   setSearchUser,
   errors,
   register,
   control,
   watch,
   selectedUser,
}: LeaveRequestModalsProps) => {
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
               modalTitle="Tambah Data Izin"
               isOpen={modalState.isAddModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleAdd)}
               isAdding={isCreating}
            >
               <LeaveForm
                  control={control}
                  errors={errors}
                  register={register}
                  selectedUser={selectedUser}
                  setSearchUser={setSearchUser}
                  userLoading={userLoading}
                  users={users}
                  watch={watch}
               />
            </AddModal>
         )}

         {modalState.isEditModalOpen && (
            <EditModal
               modalTitle="Edit Data Izin"
               isOpen={modalState.isEditModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleEdit)}
               isEditing={isUpdating}
            >
               <LeaveForm
                  control={control}
                  errors={errors}
                  register={register}
                  selectedUser={selectedUser}
                  setSearchUser={setSearchUser}
                  userLoading={userLoading}
                  users={users}
                  watch={watch}
               />
            </EditModal>
         )}

         {modalState.isApproveModalOpen && (
            <Modal
               isOpen={modalState.isApproveModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleApprove)}
               isFooter={true}
               footer={
                  <ModalFooter
                     closeModal={closeModal}
                     onConfirm={handleSubmit(handleApprove)}
                     isSubmitting={isApproving}
                     actionColor="bg-green-600 hover:bg-green-700"
                     actionLabel="Setuju"
                  />
               }
            >
               <div className="p-4">
                  <p>Apakah anda yakin ingin menyetujui permohonan izin ini?</p>
               </div>
            </Modal>
         )}
         {modalState.isRejectModalOpen && (
            <Modal
               isOpen={modalState.isRejectModalOpen}
               closeModal={closeModal}
               onConfirm={handleSubmit(handleReject)}
               isFooter={true}
               footer={
                  <ModalFooter
                     closeModal={closeModal}
                     onConfirm={handleSubmit(handleReject)}
                     isSubmitting={isApproving}
                     actionColor="bg-red-600 hover:bg-red-700"
                     actionLabel="Tolak"
                  />
               }
            >
               <div className="p-4">
                  <p>Apakah anda yakin ingin menolak permohonan izin ini?</p>

                  <div className="mt-4">
                     <TextareaField
                        label="Alasan"
                        rows={3}
                        error={
                           typeof errors.approvalNotes?.message === "string"
                              ? errors.approvalNotes.message
                              : undefined
                        }
                        register={register("approvalNotes")}
                        placeholder="Masukkan catatan..."
                     />
                  </div>
               </div>
            </Modal>
         )}
      </>
   );
};

export default LeaveRequestModals;
