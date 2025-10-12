"use client";

import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Components
import HeaderTitle from "@/components/ui/HeaderTitle";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import AttendanceSummaryCardList from "@/components/ui/Attendance/AttendanceSummaryCardList";
import AttendanceTable from "@/components/ui/Attendance/AttendanceTable";
import AttendanceModals from "@/components/ui/Attendance/AttendanceModals";
import AttendanceFilterModal from "@/components/ui/Attendance/AttendanceFilterModal";
import Pagination from "@/components/ui/Pagination";

//types
import { Attendance, AttendanceForm, User } from "@/types";

// Hooks
import {
   useAttendanceAction,
   useAttendanceByUser,
   useAttendanceModal,
   useAttendanceStatuses,
   useAttendanceSummaryCounts,
} from "@/hooks/attendance";
import { useUserById, useUsers } from "@/hooks/user";

//utils
import { debounceFilterUpdate } from "@/utils/debounce";

interface PageProps {
   params: Promise<{ slug: string }>;
}

export default function Page({ params }: Readonly<PageProps>) {
   // Extract URL params
   const { slug } = use(params);

   // Local State Definitions
   const [searchQuery, setSearchQuery] = useState<string>("");
   const [searchUser, setSearchUser] = useState<string>("");

   // Filter for attendance API query
   const [attendanceFilter, setAttendanceFilter] = useState({
      userId: null,
      attendanceStatusId: null,
      attendanceStatus: "",
      startDate: "",
      endDate: "",
      fields: null,
      sortBy: "date",
      order: "DESC",
      search: "",
      include: "status, details, user",
   });

   // Filter for user API query
   const [userFilter, setUserFilter] = useState({
      search: searchUser,
      size: 5,
      page: 1,
   });

   // Selected attendance and user for modals & editing
   const [selectedAttendance, setSelectedAttendance] =
      useState<Attendance | null>(null);
   const [selectedUser, setSelectedUser] = useState<User | undefined>();

   // Data Fetching Hooks
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
   const { attendanceStatuses, isLoading: attendanceStatusLoading } =
      useAttendanceStatuses();

   // Combine mutate calls for refresh
   const mutate = () => {
      userAttendanceMutate();
      summaryMutate();
   };

   // Form Management with React Hook Form
   const {
      register,
      control,
      handleSubmit,
      setError,
      reset,
      formState: { errors },
   } = useForm<AttendanceForm>({
      mode: "onTouched",
      defaultValues: {
         userId: "",
         date: "",
         attendanceStatusId: "",
         notes: "",
      },
   });

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

   // Effects for debounced search/filter updates
   useEffect(() => {
      debounceFilterUpdate(setAttendanceFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchUser, "search");
   }, [searchUser]);

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

   // Reset form when an attendance is selected for editing
   useEffect(() => {
      if (selectedAttendance) {
         reset({
            userId: selectedAttendance.userId?.toString() ?? "",
            date: selectedAttendance.date ?? "",
            attendanceStatusId:
               selectedAttendance.attendanceStatusId?.toString() ?? "",
            notes: selectedAttendance.notes ?? "",
         });
      }
   }, [selectedAttendance, reset]);

   // Pagination: Update page on change
   const handlePageChange = (page: number) => {
      setAttendanceFilter((prev) => ({ ...prev, page }));
   };

   // Modal Management Hooks
   const { modalState, openModal, closeModal } = useAttendanceModal(
      setSelectedUser,
      setSelectedAttendance,
      reset
   );

   // Attendance Actions (Create, Update, Delete)
   const { handleAction, isCreating, isDeleting, isUpdating } =
      useAttendanceAction(mutate, closeModal, setError);

   // Render Component
   return (
      <div className="flex flex-col w-full gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Header with back button and user name */}
         <HeaderTitle
            title={userByIdLoading ? "Loading..." : user?.data?.fullName}
            showBackButton
            navigateTo="/administrator/absensi"
            className="py-2"
         />

         {/* Toolbar, Summary Cards, and Attendance Table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <AdminTableToolbar
               searchQuery={searchQuery}
               setSearchQuery={setSearchQuery}
               openModalFilter={() => openModal(undefined, "filter")}
               openModalAdd={() => openModal(undefined, "add")}
            />

            <AttendanceSummaryCardList
               summary={summary}
               summaryLoading={summaryLoading}
            />

            <AttendanceTable
               attendances={userAttendances?.data}
               attendanceLoading={userAttendanceLoading}
               openModal={openModal}
               columnVisibility={{ user: false }}
            />
         </div>

         {/* Pagination controls */}
         <Pagination
            totalPages={userAttendances?.pagination?.totalPages ?? 1}
            currentPage={userAttendances?.pagination?.currentPage ?? 1}
            hasNextPage={userAttendances?.pagination?.hasNextPage ?? false}
            isLoading={userAttendanceLoading}
            onPageChange={handlePageChange}
         />

         {/* Attendance Modals for Add/Edit/Delete */}
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
            attendanceStatuses={attendanceStatuses?.data}
            attendanceStatusLoading={attendanceStatusLoading}
            users={users?.data}
            userLoading={userLoading}
            setSearchUser={setSearchUser}
            errors={errors}
            register={register}
            control={control}
            selectedUser={selectedUser}
         />

         {/* Attendance Filter Modal */}
         {modalState.isFilterModalOpen && (
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
