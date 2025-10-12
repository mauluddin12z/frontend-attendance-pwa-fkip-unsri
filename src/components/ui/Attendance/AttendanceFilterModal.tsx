import Modal from "@/components/ui/Modal/Modal";
import AttendanceFilterForm from "@/components/ui/Attendance/AttendanceFilterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import ModalFooter from "../Modal/ModalFooter";

const AttendanceFilterModal = ({
   isOpen,
   closeModal,
   setAttendanceFilter,
   handleFilterSubmit,
   attendanceStatuses,
   filterRegister,
   filterSetValue,
}: {
   isOpen: boolean;
   closeModal: () => void;
   setAttendanceFilter: any;
   handleFilterSubmit: any;
   attendanceStatuses: any;
   filterRegister: any;
   filterSetValue: any;
}) => {
   const applyFilters = (data: any) => {
      // Apply the filters to the global state or parent component
      setAttendanceFilter((prev: any) => ({
         ...prev,
         attendanceStatusId: data.attendanceStatusId ?? null,
         startDate: data.startDate ?? "",
         endDate: data.endDate ?? "",
      }));
      closeModal();
   };

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
         <AttendanceFilterForm
            handleFilterSubmit={handleFilterSubmit}
            attendanceStatuses={attendanceStatuses}
            register={filterRegister}
            setValue={filterSetValue}
         />
      </Modal>
   );
};

export default AttendanceFilterModal;
