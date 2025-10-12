import React from "react";
import Modal, { ModalProps } from "./Modal";
import ModalFooter from "./ModalFooter";

type EditModalProps = Omit<ModalProps, "onConfirm"> & {
   isEditing: boolean;
   onConfirm: () => void;
};

export default function EditModal({
   modalTitle,
   isOpen,
   closeModal,
   onConfirm,
   isEditing,
   children,
}: Readonly<EditModalProps>) {
   return (
      <Modal
         modalTitle={modalTitle}
         isOpen={isOpen}
         closeModal={closeModal}
         isFooter={true}
         footer={
            <ModalFooter
               closeModal={closeModal}
               onConfirm={onConfirm}
               isSubmitting={isEditing}
               actionColor="bg-blue-600 hover:bg-blue-700"
               actionLabel="Edit"
            />
         }
      >
         {children}
      </Modal>
   );
}
