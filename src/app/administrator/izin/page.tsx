"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
   Attendance,
   AttendanceForm,
   LeaveRequest,
   LeaveRequestForm,
   LeaveUser,
   User,
} from "@/types";
import Pagination from "@/components/ui/Pagination";
import { debounceFilterUpdate } from "@/utils/debounce";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import { useUsers } from "@/hooks/user";
import { useAdministratorModal } from "@/hooks/misc";
import { useLeaveRequestAction, useLeaveRequests } from "@/hooks/leave-request";
import LeaveRequestTable from "@/components/ui/Leave/LeaveRequestTable";
import LeaveRequestModals from "@/components/ui/Leave/LeaveRequestModals";
import { useAuth } from "@/context/AuthContext";
import LeaveFilterModal from "@/components/ui/Leave/LeaveFilterModal";

export default function Page() {
   // State management for search query and filters
   const [searchQuery, setSearchQuery] = useState("");
   const [leaveRequestFilter, setLeaveRequestFilter] = useState({
      userId: null,
      status: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      fields: null,
      sortBy: "date",
      order: "DESC",
      search: "",
      include: "leaveUser,approver",
   });

   const [searchUser, setSearchUser] = useState("");
   const [userFilter, setUserFilter] = useState({
      search: searchUser,
      size: 5,
      page: 1,
   });

   // Debounced update for search query and user filter
   useEffect(() => {
      debounceFilterUpdate(setLeaveRequestFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchUser, "search");
   }, [searchUser]);

   // Handle page change in the pagination component
   const handlePageChange = (page: number) => {
      setLeaveRequestFilter((prev) => ({ ...prev, page }));
   };

   // Apply the filters to the global state or parent component
   const applyFilters = (data: any) => {
      setLeaveRequestFilter((prev: any) => ({
         ...prev,
         status: data.status ?? null,
         startDate: data.startDate ?? "",
         endDate: data.endDate ?? "",
      }));
      closeModal();
   };

   // Form handling for filters
   const {
      register: filterRegister,
      setValue: filterSetValue,
      handleSubmit: handleFilterSubmit,
   } = useForm({
      mode: "onTouched",
      defaultValues: {
         status: "",
         leaveType: "",
         startDate: "",
         endDate: "",
      },
   });

   // Data fetching hooks for leave requests, statuses, users, and CRUD actions
   const {
      leaveRequests,
      isLoading: leaveRequestLoading,
      mutate: leaveRequestMutate,
   } = useLeaveRequests(leaveRequestFilter);
   const { users, isLoading: userLoading } = useUsers(userFilter);

   // State management for modal visibility and selected leaveRequest
   const [selectedLeaveRequest, setSelectedLeaveRequest] =
      useState<LeaveRequest | null>(null);
   const [selectedUser, setSelectedUser] = useState<LeaveUser | null>(null);

   const leaveRequestDefaultValues: LeaveRequestForm = {
      userId: "",
      startDate: "",
      endDate: "",
      leaveType: "",
      reason: "",
      status: "",
      approverId: "",
      approvalNotes: "",
   };

   // Form handling for leave request data
   const {
      register,
      control,
      watch,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
   } = useForm<LeaveRequestForm>({
      mode: "onTouched",
      defaultValues: leaveRequestDefaultValues,
   });

   useEffect(() => {
      if (selectedLeaveRequest) {
         setSelectedUser(selectedLeaveRequest?.leaveUser || null);
         reset({
            userId: selectedLeaveRequest?.userId?.toString() ?? "",
            startDate: selectedLeaveRequest?.startDate ?? "",
            endDate: selectedLeaveRequest?.endDate ?? "",
            leaveType: selectedLeaveRequest?.leaveType ?? "",
            status: selectedLeaveRequest?.status ?? "",
            reason: selectedLeaveRequest?.reason ?? "",
         });
      }
   }, [selectedLeaveRequest, reset]);

   // Modal Management Hooks
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedLeaveRequest,
      () => reset(leaveRequestDefaultValues)
   );

   // Attendance Actions (Create, Update, Delete)
   const {
      handleAction,
      isCreating,
      isDeleting,
      isUpdating,
      isApproving,
      isRejecting,
   } = useLeaveRequestAction(leaveRequestMutate, closeModal, setError);

   return (
      <div className="flex flex-col justify-center gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Toolbar for search and filter */}
         <AdminTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
         />

         {/* Leave request table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <LeaveRequestTable
               leaveRequests={leaveRequests?.data}
               leaveRequestLoading={leaveRequestLoading}
               openModal={openModal}
            />
         </div>

         {/* Modals for add, edit, detail, delete, and filter */}
         <LeaveRequestModals
            modalState={modalState}
            closeModal={closeModal}
            handleDelete={() =>
               handleAction("delete", undefined, selectedLeaveRequest)
            }
            handleSubmit={handleSubmit}
            handleEdit={(data: LeaveRequestForm) =>
               handleAction("edit", data, selectedLeaveRequest)
            }
            handleAdd={(data: LeaveRequestForm) => handleAction("add", data)}
            handleApprove={(data: LeaveRequestForm) =>
               handleAction("approve", data, selectedLeaveRequest)
            }
            handleReject={(data: LeaveRequestForm) =>
               handleAction("reject", data, selectedLeaveRequest)
            }
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            isApproving={isApproving}
            isRejecting={isRejecting}
            selectedLeaveRequest={selectedLeaveRequest!}
            selectedUser={selectedUser!}
            users={users?.data}
            userLoading={userLoading}
            setSearchUser={setSearchUser}
            errors={errors}
            register={register}
            control={control}
            watch={watch}
         />

         {/* Pagination */}
         <Pagination
            totalPages={leaveRequests?.pagination?.totalPages ?? 1}
            currentPage={leaveRequests?.pagination?.currentPage ?? 1}
            hasNextPage={leaveRequests?.pagination?.hasNextPage ?? false}
            isLoading={leaveRequestLoading}
            onPageChange={handlePageChange}
         />

         {/* Filter modal for attendance list filtering */}
         {modalState.isFilterModalOpen && (
            <LeaveFilterModal
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
