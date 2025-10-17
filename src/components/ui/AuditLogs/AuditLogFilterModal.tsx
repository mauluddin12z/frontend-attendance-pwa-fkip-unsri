import FilterModal from "../Modal/FilterModal";
import {
   SubmitHandler,
   UseFormRegister,
   UseFormSetValue,
} from "react-hook-form";
import AuditLogFilterForm from "./AuditLogFilterForm";

interface AuditLogFilterModalProps {
   isOpen: boolean;
   closeModal: () => void;
   filterRegister: UseFormRegister<any>;
   filterSetValue: UseFormSetValue<any>;
   handleFilterSubmit: any;
   applyFilters: (data: any) => void;
}
const AuditLogFilterModal = ({
   isOpen,
   closeModal,
   filterRegister,
   filterSetValue,
   handleFilterSubmit,
   applyFilters,
}: AuditLogFilterModalProps) => {
   return (
      <FilterModal
         isOpen={isOpen}
         closeModal={closeModal}
         handleFilterSubmit={handleFilterSubmit}
         applyFilters={applyFilters}
      >
         <AuditLogFilterForm
            handleFilterSubmit={handleFilterSubmit}
            register={filterRegister}
            setValue={filterSetValue}
         />
      </FilterModal>
   );
};

export default AuditLogFilterModal;
