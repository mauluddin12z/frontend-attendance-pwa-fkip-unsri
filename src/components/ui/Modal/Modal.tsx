import React, { useEffect, useCallback } from "react";

export interface ModalProps {
   isOpen: boolean;
   closeModal: () => void;
   onConfirm?: () => void;
   modalTitle?: React.ReactNode;
   children: React.ReactNode;
   isFooter?: boolean;
   footer?: React.ReactNode;
   width?: string;
}

const Modal: React.FC<ModalProps> = ({
   isOpen,
   closeModal,
   onConfirm,
   children,
   modalTitle,
   isFooter = true,
   footer,
   width = "max-w-[calc(100%-24px)]",
}) => {
   const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
         if (e.key === "Escape") closeModal();
      },
      [closeModal]
   );

   useEffect(() => {
      if (isOpen) {
         document.addEventListener("keydown", handleKeyDown);
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }

      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         document.body.style.overflow = "";
      };
   }, [isOpen, handleKeyDown]);

   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         closeModal();
      }
   };

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 bg-black/50 z-[99] flex items-center justify-center"
         role="dialog"
         aria-modal="true"
         onClick={handleBackdropClick}
      >
         {/* Modal container */}
         <div
            className={`bg-white rounded-lg shadow-xl ${width} max-h-[90vh] overflow-hidden`}
         >
            {/* Header */}
            <div
               className={`flex ${
                  modalTitle ? "justify-between" : "justify-end"
               } items-center p-4`}
            >
               {modalTitle && (
                  <h2 className="text-xl font-semibold">{modalTitle}</h2>
               )}
               <button
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
               >
                  &times;
               </button>
            </div>

            {/* Content: Scrollable */}
            <div className="overflow-y-auto max-h-[60vh]">{children}</div>

            {/* Footer */}
            {footer ? (
               <div className="flex justify-end space-x-4 pt-2 p-4">
                  {footer}
               </div>
            ) : isFooter ? (
               <div className="flex justify-end space-x-4 pt-2 p-4">
                  <button
                     onClick={closeModal}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                  >
                     Cancel
                  </button>
                  {onConfirm && (
                     <button
                        onClick={() => {
                           onConfirm();
                           closeModal();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                     >
                        Confirm
                     </button>
                  )}
               </div>
            ) : null}
         </div>
      </div>
   );
};

export default Modal;
