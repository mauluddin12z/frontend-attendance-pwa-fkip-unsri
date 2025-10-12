import AddModal from "../Modal/AddModal";
import DeleteModal from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";
import Modal from "../Modal/Modal";
import AttendanceForm from "./AttendanceForm";
import AttendanceListCard from "./AttendanceListCard";

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
   attendanceStatuses,
   attendanceStatusLoading,
   users,
   userLoading,
   setSearchUser,
   errors,
   register,
   control,
   selectedUser,
}: any) => {
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
                  day={selectedAttendance?.date}
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
                  formType="add"
                  register={register}
                  control={control}
                  errors={errors}
                  attendanceStatuses={attendanceStatuses}
                  attendanceStatusLoading={attendanceStatusLoading}
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
                  formType="edit"
                  register={register}
                  control={control}
                  errors={errors}
                  attendanceStatuses={attendanceStatuses}
                  attendanceStatusLoading={attendanceStatusLoading}
                  selectedUser={selectedUser}
               />
            </EditModal>
         )}
      </>
   );
};

export default AttendanceModals;
