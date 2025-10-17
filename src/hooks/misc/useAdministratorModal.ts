import { useCallback, useState } from "react";

// General modal state and types
export type ModalState = {
   isDetailModalOpen: boolean;
   isAddModalOpen: boolean;
   isEditModalOpen: boolean;
   isDeleteModalOpen: boolean;
   isFilterModalOpen: boolean;
   isApproveModalOpen: boolean;
   isRejectModalOpen: boolean;
};

type ModalTypes =
   | "detail"
   | "add"
   | "edit"
   | "delete"
   | "filter"
   | "approve"
   | "reject";

// General modal hook
export default function useModal<T>(
   setSelectedItem?: (data: T | null) => void,
   resetForm?: () => void
) {
   const [modalState, setModalState] = useState<ModalState>({
      isDetailModalOpen: false,
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isFilterModalOpen: false,
      isApproveModalOpen: false,
      isRejectModalOpen: false,
   });

   const openModal = useCallback(
      (item: T | undefined, modalType: ModalTypes) => {
         if (setSelectedItem) setSelectedItem(item ?? null);

         setModalState({
            isDetailModalOpen: modalType === "detail",
            isAddModalOpen: modalType === "add",
            isEditModalOpen: modalType === "edit",
            isDeleteModalOpen: modalType === "delete",
            isFilterModalOpen: modalType === "filter",
            isApproveModalOpen: modalType === "approve",
            isRejectModalOpen: modalType === "reject",
         });
      },
      [setSelectedItem]
   );

   const closeModal = useCallback(() => {
      if (setSelectedItem) setSelectedItem(null);
      if (resetForm) resetForm();
      setModalState({
         isDetailModalOpen: false,
         isAddModalOpen: false,
         isEditModalOpen: false,
         isDeleteModalOpen: false,
         isFilterModalOpen: false,
         isApproveModalOpen: false,
         isRejectModalOpen: false,
      });
   }, [setSelectedItem, resetForm, setModalState]);

   return { modalState, openModal, closeModal };
}
