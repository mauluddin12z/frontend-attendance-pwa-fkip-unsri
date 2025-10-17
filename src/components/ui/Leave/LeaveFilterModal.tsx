import FilterModal from "../Modal/FilterModal";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import LeaveFilterForm from "./LeaveFilterForm";

interface LeaveFilterModalProps {
   isOpen: boolean;
   closeModal: () => void;
   filterRegister: UseFormRegister<any>;
   filterSetValue: UseFormSetValue<any>;
   handleFilterSubmit: any;
   applyFilters: (data: any) => void;
}
const LeaveFilterModal = ({
   isOpen,
   closeModal,
   filterRegister,
   filterSetValue,
   handleFilterSubmit,
   applyFilters,
}: LeaveFilterModalProps) => {
   return (
      <FilterModal
         isOpen={isOpen}
         closeModal={closeModal}
         handleFilterSubmit={handleFilterSubmit}
         applyFilters={applyFilters}
      >
         <LeaveFilterForm
            handleFilterSubmit={handleFilterSubmit}
            register={filterRegister}
            setValue={filterSetValue}
         />
      </FilterModal>
   );
};

export default LeaveFilterModal;
