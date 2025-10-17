import AttendanceFilterForm from "@/components/ui/Attendance/AttendanceFilterForm";
import FilterModal from "../Modal/FilterModal";
import {
   SubmitHandler,
   UseFormRegister,
   UseFormSetValue,
} from "react-hook-form";

interface AttendanceFilterModalProps {
   isOpen: boolean;
   closeModal: () => void;
   filterRegister: UseFormRegister<any>;
   filterSetValue: UseFormSetValue<any>;
   handleFilterSubmit: any;
   applyFilters: (data: any) => void;
}
const AttendanceFilterModal = ({
   isOpen,
   closeModal,
   filterRegister,
   filterSetValue,
   handleFilterSubmit,
   applyFilters,
}: AttendanceFilterModalProps) => {
   return (
      <FilterModal
         isOpen={isOpen}
         closeModal={closeModal}
         handleFilterSubmit={handleFilterSubmit}
         applyFilters={applyFilters}
      >
         <AttendanceFilterForm
            handleFilterSubmit={handleFilterSubmit}
            register={filterRegister}
            setValue={filterSetValue}
         />
      </FilterModal>
   );
};

export default AttendanceFilterModal;
