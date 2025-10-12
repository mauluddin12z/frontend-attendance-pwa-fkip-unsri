import React from "react";
import Modal from "./Modal/Modal";

interface ModalProps {
   isOpen: boolean;
   closeModal: () => void;
   onConfirm?: () => void;
}

export default function LogoutModal({
   isOpen,
   closeModal,
   onConfirm,
}: Readonly<ModalProps>) {
   return (
      <Modal
         isOpen={isOpen}
         closeModal={closeModal}
         isFooter={true}
         footer={
            <div className="flex justify-end space-x-4 pt-2">
               <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
               >
                  Batal
               </button>
               <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
               >
                  Logout
               </button>
            </div>
         }
      >
         <p className="text-sm text-gray-800 p-4">
            Apakah Anda yakin ingin logout?
         </p>
      </Modal>
   );
}
