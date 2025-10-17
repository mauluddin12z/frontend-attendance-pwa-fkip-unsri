"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Attendance, AttendanceForm, User } from "@/types";
import Pagination from "@/components/ui/Pagination";
import AttendanceTable from "@/components/ui/Attendance/AttendanceTable";
import AttendanceModals from "@/components/ui/Attendance/AttendanceModals";
import AttendanceFilterModal from "@/components/ui/Attendance/AttendanceFilterModal";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";

import { debounceFilterUpdate } from "@/utils/debounce";

import {
   useAttendanceAction,
   useAttendances,
   useAttendanceStatuses,
} from "@/hooks/attendance";

import { useUserById, useUsers } from "@/hooks/user";
import { useAdministratorModal } from "@/hooks/misc";

export default function Page() {
   // Search query for attendance records
   const [searchQuery, setSearchQuery] = useState("");

   // Filters for attendance fetching API
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

   // Search and pagination for user filtering (used in modals)
   const [searchUser, setSearchUser] = useState("");
   const [userFilter, setUserFilter] = useState({
      search: searchUser,
      size: 5,
      page: 1,
   });

   // Debounced updates for search filters
   useEffect(() => {
      debounceFilterUpdate(setAttendanceFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchUser, "search");
   }, [searchUser]);

   // Pagination handler for table
   const handlePageChange = (page: number) => {
      setAttendanceFilter((prev) => ({ ...prev, page }));
   };

   // Apply the filters to the global state or parent component
   const applyFilters = (data: any) => {
      setAttendanceFilter((prev: any) => ({
         ...prev,
         attendanceStatusId: data.attendanceStatusId ?? null,
         startDate: data.startDate ?? "",
         endDate: data.endDate ?? "",
      }));
      closeModal();
   };

   // Form setup: Filter Modal
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

   // Data fetching (hooks)
   const {
      attendances,
      isLoading: attendanceLoading,
      mutate: attendanceMutate,
   } = useAttendances(attendanceFilter);

   const { users, isLoading: userLoading } = useUsers(userFilter);

   // Selected records & modal management
   const [selectedAttendance, setSelectedAttendance] =
      useState<Attendance | null>(null);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   // Form setup: Attendance Modal
   const attendanceDefaultValues: AttendanceForm = {
      userId: "",
      date: "",
      attendanceStatusId: "",
      notes: "",
   };

   const {
      register,
      control,
      watch,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
   } = useForm<AttendanceForm>({
      mode: "onTouched",
      defaultValues: attendanceDefaultValues,
   });

   // Modal state & control
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedAttendance,
      () => reset(attendanceDefaultValues)
   );

   // Reset form when selected attendance changes
   useEffect(() => {
      setSelectedUser(selectedAttendance?.user || null);
      reset({
         userId: selectedAttendance?.userId?.toString() ?? "",
         date: selectedAttendance?.date ?? "",
         attendanceStatusId:
            selectedAttendance?.attendanceStatusId?.toString() ?? "",
         notes: selectedAttendance?.notes ?? "",
      });
   }, [selectedAttendance, modalState, reset]);

   // Attendance CRUD actions
   const { handleAction, isCreating, isDeleting, isUpdating } =
      useAttendanceAction(attendanceMutate, closeModal, setError);

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Toolbar with search input and action buttons */}
         <AdminTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
         />

         {/* Attendance records table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <AttendanceTable
               attendances={attendances?.data}
               attendanceLoading={attendanceLoading}
               openModal={openModal}
            />
         </div>

         {/* Pagination controls */}
         <Pagination
            totalPages={attendances?.pagination?.totalPages ?? 1}
            currentPage={attendances?.pagination?.currentPage ?? 1}
            hasNextPage={attendances?.pagination?.hasNextPage ?? false}
            isLoading={attendanceLoading}
            onPageChange={handlePageChange}
         />

         {/* Modals: Add/Edit/View/Delete attendance */}
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
            selectedAttendance={selectedAttendance!}
            selectedUser={selectedUser!}
            users={users?.data}
            userLoading={userLoading}
            setSearchUser={setSearchUser}
            errors={errors}
            register={register}
            control={control}
            watch={watch}
         />

         {/* Filter modal for attendance list filtering */}
         {modalState.isFilterModalOpen && (
            <AttendanceFilterModal
               isOpen={modalState.isFilterModalOpen}
               closeModal={closeModal}
               filterRegister={filterRegister}
               handleFilterSubmit={handleFilterSubmit}
               filterSetValue={filterSetValue}
               applyFilters={applyFilters}
            />
         )}
      </div>
   );
}
