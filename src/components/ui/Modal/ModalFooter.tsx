import React from "react";
import LoadingSpinner from "../Loading/LoadingSpinner";

export default function ModalFooter({
   closeModal,
   onConfirm,
   isSubmitting,
   actionColor,
   actionLabel,
}: Readonly<{
   closeModal: () => void;
   onConfirm: () => void;
   isSubmitting: boolean;
   actionColor: string;
   actionLabel: string;
}>) {
   return (
      <div className="flex justify-end space-x-4 pt-2">
         <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition cursor-pointer"
         >
            Batal
         </button>
         <button
            onClick={onConfirm}
            className={`px-4 py-2 ${actionColor} text-white rounded-lg transition ${
               isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
         >
            {isSubmitting ? (
               <div className="flex gap-x-2">
                  <LoadingSpinner className="fill-white" /> Loading...
               </div>
            ) : (
               actionLabel
            )}
         </button>
      </div>
   );
}
