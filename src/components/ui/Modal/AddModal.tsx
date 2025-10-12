import React from "react";
import Modal, { ModalProps } from "./Modal";
import ModalFooter from "./ModalFooter";


type AddModalProps = Omit<ModalProps, "onConfirm"> & {
   isAdding: boolean;
   onConfirm: () => void;
};

export default function AddModal({
   modalTitle,
   isOpen,
   closeModal,
   onConfirm,
   isAdding,
   children,
}: Readonly<AddModalProps>) {
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
               isSubmitting={isAdding}
               actionColor="bg-green-600 hover:bg-green-700"
               actionLabel="Tambah"
            />
         }
      >
         {children}
      </Modal>
   );
}
