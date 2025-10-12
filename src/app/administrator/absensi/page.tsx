"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Attendance, AttendanceForm, User } from "@/types";
import Pagination from "@/components/ui/Pagination";
import AttendanceTable from "@/components/ui/Attendance/AttendanceTable";
import AttendanceModals from "@/components/ui/Attendance/AttendanceModals";
import { debounceFilterUpdate } from "@/utils/debounce";
import AttendanceFilterModal from "@/components/ui/Attendance/AttendanceFilterModal";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import {
   useAttendanceAction,
   useAttendanceModal,
   useAttendances,
   useAttendanceStatuses,
} from "@/hooks/attendance";
import { useUsers } from "@/hooks/user";

export default function Page() {
   // State management for search query and filters
   const [searchQuery, setSearchQuery] = useState("");
   const [attendanceFilter, setAttendanceFilter] = useState({
      userId: null,
      attendanceStatusId: null,
      startDate: "",
      endDate: "",
      fields: null,
      sortBy: "date",
      order: "DESC",
      search: "",
      attendanceType: "",
      include: "details,status,user",
   });

   const [searchUser, setSearchUser] = useState("");
   const [userFilter, setUserFilter] = useState({
      search: searchUser,
      size: 5,
      page: 1,
   });

   // Debounced update for search query and user filter
   useEffect(() => {
      debounceFilterUpdate(setAttendanceFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchUser, "search");
   }, [searchUser]);

   // Handle page change in the pagination component
   const handlePageChange = (page: number) => {
      setAttendanceFilter((prev) => ({ ...prev, page }));
   };

   // Form handling for filters
   const {
      register: filterRegister,
      setValue: filterSetValue,
      handleSubmit: handleFilterSubmit,
   } = useForm({
      mode: "onTouched",
      defaultValues: {
         attendanceStatusId: "",
         startDate: "",
         endDate: "",
         attendanceType: "",
      },
   });

   // Data fetching hooks for attendances, statuses, users, and CRUD actions
   const {
      attendances,
      isLoading: attendanceLoading,
      mutate: attendanceMutate,
   } = useAttendances(attendanceFilter);
   const { attendanceStatuses, isLoading: attendanceStatusLoading } =
      useAttendanceStatuses();
   const { users, isLoading: userLoading } = useUsers(userFilter);

   // State management for modal visibility and selected attendance
   const [selectedAttendance, setSelectedAttendance] =
      useState<Attendance | null>(null);
   const [selectedUser, setSelectedUser] = useState<User>();

   // Form handling for attendance data
   const {
      register,
      control,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
   } = useForm<AttendanceForm>({
      mode: "onTouched",
      defaultValues: {
         userId: "",
         date: "",
         attendanceStatusId: "",
         notes: "",
      },
   });

   // Populate form with selected attendance data when opening the edit modal
   useEffect(() => {
      if (selectedAttendance) {
         setSelectedUser(selectedAttendance?.user);
         reset({
            userId: selectedAttendance.userId?.toString() ?? "",
            date: selectedAttendance.date ?? "",
            attendanceStatusId:
               selectedAttendance.attendanceStatusId?.toString() ?? "",
            notes: selectedAttendance.notes ?? "",
         });
      }
   }, [selectedAttendance, reset]);

   const { modalState, openModal, closeModal } = useAttendanceModal(
      setSelectedUser,
      setSelectedAttendance,
      reset
   );

   const { handleAction, isCreating, isDeleting, isUpdating } =
      useAttendanceAction(attendanceMutate, closeModal, setError);

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Toolbar for search and filter */}
         <AdminTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
         />

         {/* Attendance table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <AttendanceTable
               attendances={attendances?.data}
               attendanceLoading={attendanceLoading}
               openModal={openModal}
            />
         </div>

         {/* Pagination */}
         <Pagination
            totalPages={attendances?.pagination?.totalPages ?? 1}
            currentPage={attendances?.pagination?.currentPage ?? 1}
            hasNextPage={attendances?.pagination?.hasNextPage ?? false}
            isLoading={attendanceLoading}
            onPageChange={handlePageChange}
         />

         {/* Modals for add, edit, detail, delete, and filter */}
         <AttendanceModals
            modalState={modalState}
            closeModal={closeModal}
            handleDelete={() =>
               handleAction("delete", undefined, selectedAttendance)
            }
            handleSubmit={handleSubmit}
            handleEdit={(data: Attendance) =>
               handleAction("edit", data, selectedAttendance)
            }
            handleAdd={(data: Attendance) => handleAction("add", data)}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            selectedAttendance={selectedAttendance}
            selectedUser={selectedUser}
            attendanceStatuses={attendanceStatuses?.data}
            attendanceStatusLoading={attendanceStatusLoading}
            users={users?.data}
            userLoading={userLoading}
            setSearchUser={setSearchUser}
            errors={errors}
            register={register}
            control={control}
         />

         {/* Filter modal */}
         {modalState && (
            <AttendanceFilterModal
               isOpen={modalState.isFilterModalOpen}
               attendanceStatuses={attendanceStatuses?.data}
               closeModal={closeModal}
               filterRegister={filterRegister}
               handleFilterSubmit={handleFilterSubmit}
               setAttendanceFilter={setAttendanceFilter}
               filterSetValue={filterSetValue}
            />
         )}
      </div>
   );
}
