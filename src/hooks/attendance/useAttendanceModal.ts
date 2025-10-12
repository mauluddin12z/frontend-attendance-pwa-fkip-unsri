import { Attendance } from "@/types";
import { useCallback, useState } from "react";

type ModalState = {
   isDetailModalOpen: boolean;
   isAddModalOpen: boolean;
   isEditModalOpen: boolean;
   isDeleteModalOpen: boolean;
   isFilterModalOpen: boolean;
};

export default function useAttendanceModal(
   setSelectedUser: any,
   setSelectedAttendance: any,
   reset: any
) {
   const [modalState, setModalState] = useState<ModalState>({
      isDetailModalOpen: false,
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isFilterModalOpen: false,
   });
   const openModal = useCallback(
      (
         attendance: Attendance | undefined,
         modalType: "detail" | "add" | "edit" | "delete" | "filter"
      ) => {
         setSelectedAttendance(attendance ?? null);

         setModalState({
            isDetailModalOpen: modalType === "detail",
            isAddModalOpen: modalType === "add",
            isEditModalOpen: modalType === "edit",
            isDeleteModalOpen: modalType === "delete",
            isFilterModalOpen: modalType === "filter",
         });
      },
      []
   );

   // Close modal and reset form
   const closeModal = useCallback(() => {
      setSelectedAttendance(null);
      setSelectedUser(null);
      setModalState({
         isDetailModalOpen: false,
         isAddModalOpen: false,
         isEditModalOpen: false,
         isDeleteModalOpen: false,
         isFilterModalOpen: false,
      });
      reset({
         userId: "",
         date: "",
         attendanceStatusId: "",
         notes: "",
      });
   }, [reset]);

   return { modalState, openModal, closeModal };
}
