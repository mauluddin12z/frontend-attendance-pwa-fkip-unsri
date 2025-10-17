"use client";

import React, { useState, useEffect, use } from "react";
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
   useAttendanceByUser,
   useAttendanceStatuses,
   useAttendanceSummaryCounts,
} from "@/hooks/attendance";

import { useUserById, useUsers } from "@/hooks/user";
import { useAdministratorModal } from "@/hooks/misc";
import AttendanceSummaryCardList from "@/components/ui/Attendance/AttendanceSummaryCardList";
import HeaderTitle from "@/components/ui/HeaderTitle";

interface PageProps {
   params: Promise<{ slug: string }>;
}

export default function Page({ params }: Readonly<PageProps>) {
   // Extract URL params
   const { slug } = use(params);
   // State for attendance search and filters
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

   // State for user search in filter modals
   const [searchUser, setSearchUser] = useState("");
   const [userFilter, setUserFilter] = useState({
      search: searchUser,
      size: 5,
      page: 1,
   });

   // Debounced update for attendance search filter
   useEffect(() => {
      debounceFilterUpdate(setAttendanceFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   // Debounced update for user search filter
   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchUser, "search");
   }, [searchUser]);

   // Handle pagination page change
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

   // Form setup for attendance filter modal
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

   // Data fetching hooks
   const {
      userAttendances,
      isLoading: userAttendanceLoading,
      mutate: userAttendanceMutate,
   } = useAttendanceByUser(parseInt(slug), attendanceFilter);

   const {
      summary,
      isLoading: summaryLoading,
      mutateAll: summaryMutate,
   } = useAttendanceSummaryCounts(parseInt(slug), attendanceFilter);
   const { user, isLoading: userByIdLoading } = useUserById(parseInt(slug));
   const { users, isLoading: userLoading } = useUsers(userFilter);

   // Selected attendance and user state
   const [selectedAttendance, setSelectedAttendance] =
      useState<Attendance | null>(null);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   // Combine mutate calls for refresh
   const mutate = () => {
      userAttendanceMutate();
      summaryMutate();
   };

   // Default form values for attendance form
   const attendanceDefaultValues: AttendanceForm = {
      userId: "",
      date: "",
      attendanceStatusId: "",
      notes: "",
   };

   // Form setup for attendance add/edit
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
   // Reset form and set selected user when user data is loaded
   useEffect(() => {
      if (user) {
         setSelectedUser(user.data);
         reset({
            userId: user?.data.id,
            date: "",
            attendanceStatusId: "",
            notes: "",
         });
      }
   }, [user, reset]);

   // Reset attendance form when selected attendance changes
   useEffect(() => {
      setSelectedUser(selectedAttendance?.user || null);
      reset({
         userId: selectedAttendance?.userId?.toString() ?? "",
         date: selectedAttendance?.date ?? "",
         attendanceStatusId:
            selectedAttendance?.attendanceStatusId?.toString() ?? "",
         notes: selectedAttendance?.notes ?? "",
      });
   }, [selectedAttendance, reset]);

   // Modal state and control hooks
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedAttendance,
      () => reset(attendanceDefaultValues)
   );

   // Attendance CRUD actions
   const { handleAction, isCreating, isDeleting, isUpdating } =
      useAttendanceAction(mutate, closeModal, setError);

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Header with back button and user name */}
         <HeaderTitle
            title={userByIdLoading ? "Loading..." : user?.data?.fullName}
            showBackButton
            navigateTo="/administrator/absensi"
            className="py-2"
         />

         {/* Toolbar with search and filter/add buttons */}
         <AdminTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
         />

         {/* Summary Dashboard */}
         <AttendanceSummaryCardList
            summary={summary}
            summaryLoading={summaryLoading}
         />

         {/* Attendance table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <AttendanceTable
               attendances={userAttendances?.data}
               attendanceLoading={userAttendanceLoading}
               openModal={openModal}
               columnVisibility={{ user: false }}
            />
         </div>

         {/* Pagination component */}
         <Pagination
            totalPages={userAttendances?.pagination?.totalPages ?? 1}
            currentPage={userAttendances?.pagination?.currentPage ?? 1}
            hasNextPage={userAttendances?.pagination?.hasNextPage ?? false}
            isLoading={userAttendanceLoading}
            onPageChange={handlePageChange}
         />

         {/* Attendance modals: add, edit, delete, detail */}
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
