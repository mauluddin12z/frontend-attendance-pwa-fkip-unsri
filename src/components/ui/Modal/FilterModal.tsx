import Modal from "@/components/ui/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import ModalFooter from "../Modal/ModalFooter";

const FilterModal = ({
   isOpen,
   closeModal,
   children,
   handleFilterSubmit,
   applyFilters,
}: {
   isOpen: boolean;
   closeModal: () => void;
   children: React.ReactNode;
   handleFilterSubmit: any;
   applyFilters: any;
}) => {
   return (
      <Modal
         isOpen={isOpen}
         closeModal={closeModal}
         modalTitle={
            <div className="flex gap-x-2">
               <FontAwesomeIcon className="mr-2" icon={faFilter} />
               Filter
            </div>
         }
         isFooter={false}
         footer={
            <ModalFooter
               closeModal={closeModal}
               onConfirm={handleFilterSubmit(applyFilters)}
               isSubmitting={false}
               actionColor="bg-blue-600 hover:bg-blue-700"
               actionLabel="Apply"
            />
         }
      >
         {children}
      </Modal>
   );
};

export default FilterModal;
