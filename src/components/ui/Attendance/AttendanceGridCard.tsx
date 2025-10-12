import React, { useState } from "react";
import { Attendance } from "@/types";
import customMoment from "@/utils/customMoment";
import Modal from "../Modal/Modal";
import AttendanceListCard from "./AttendanceListCard";
import {
   AttendanceStatusName,
   attendanceStatusStyle,
} from "@/utils/attendanceStatusStyle";

const getDotClass = (status?: string): string => {
   const isValidStatus = (status: string): status is AttendanceStatusName =>
      status in attendanceStatusStyle;

   return status && isValidStatus(status)
      ? attendanceStatusStyle[status].dotColor
      : "";
};

type AttendanceGridCardProps = {
   day: string;
   attendance?: Attendance;
   isOutsideMonth?: boolean;
};

const AttendanceGridCard: React.FC<AttendanceGridCardProps> = ({
   day,
   attendance,
   isOutsideMonth,
}) => {
   const statusName = attendance?.attendanceStatus?.name;

   const dotClass = getDotClass(statusName !== "---" ? statusName : undefined);

   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

   // Only open modal if there's a status
   const openModal = () => {
      if (statusName) {
         setIsModalOpen(true);
      }
   };

   const closeModal = () => setIsModalOpen(false);

   return (
      <div className="relative">
         {/* Modal */}
         {isModalOpen && (
            <Modal
               isOpen={isModalOpen}
               closeModal={closeModal}
               modalTitle="Detail Absensi"
               isFooter={false}
               width="w-[calc(100%-24px)]"
            >
               <AttendanceListCard day={day} attendance={attendance} />
            </Modal>
         )}

         {/* Attendance Grid Card */}
         <button
            onClick={openModal}
            className={`bg-white ${
               !isOutsideMonth && statusName && "hover:bg-gray-100"
            } p-2 w-full ${isOutsideMonth ? "text-gray-400" : "text-black"}`}
         >
            <div className="h-full flex flex-col justify-center items-center gap-y-2">
               <span className="font-medium text-sm">
                  {customMoment(day).format("D")}
               </span>
               <div
                  className={`w-2 h-2 rounded-full ${dotClass}`}
                  title={statusName || "No Status"}
               />
            </div>
         </button>
      </div>
   );
};

export default AttendanceGridCard;
