import React from "react";
import Modal, { ModalProps } from "./Modal";
import ModalFooter from "./ModalFooter";

type DeleteModalProps = Omit<ModalProps, "onConfirm" | "children"> & {
   isDeleting: boolean;
   onConfirm: () => void;
};

export default function DeleteModal({
   isOpen,
   closeModal,
   onConfirm,
   isDeleting,
}: Readonly<DeleteModalProps>) {
   return (
      <Modal
         isOpen={isOpen}
         closeModal={closeModal}
         isFooter={true}
         footer={
            <ModalFooter
               closeModal={closeModal}
               onConfirm={onConfirm}
               isSubmitting={isDeleting}
               actionColor="bg-red-600 hover:bg-red-700"
               actionLabel="Delete"
            />
         }
      >
         <p className="text-sm text-gray-800 p-4">
            Apakah Anda yakin ingin menghapus data ini?
         </p>
      </Modal>
   );
}
