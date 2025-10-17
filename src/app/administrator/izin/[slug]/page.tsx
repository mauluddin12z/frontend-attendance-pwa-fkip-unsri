"use client";

import React, { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";

import Pagination from "@/components/ui/Pagination";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import LeaveRequestTable from "@/components/ui/Leave/LeaveRequestTable";
import LeaveRequestModals from "@/components/ui/Leave/LeaveRequestModals";

import { debounceFilterUpdate } from "@/utils/debounce";

import { useUserById, useUsers } from "@/hooks/user";
import { useAdministratorModal } from "@/hooks/misc";
import {
   useLeaveRequestAction,
   useLeaveRequestsByUser,
} from "@/hooks/leave-request";

import { LeaveRequest, LeaveRequestForm, LeaveUser } from "@/types";
import LeaveFilterModal from "@/components/ui/Leave/LeaveFilterModal";
import HeaderTitle from "@/components/ui/HeaderTitle";

interface PageProps {
   params: Promise<{ slug: string }>;
}

export default function Page({ params }: Readonly<PageProps>) {
   // Extract user ID from URL params
   const { slug } = use(params);

   // State for search and leave request filters
   const [searchQuery, setSearchQuery] = useState("");
   const [leaveRequestFilter, setLeaveRequestFilter] = useState({
      userId: null,
      status: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      fields: null,
      sortBy: "createdAt",
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

   // Debounce search inputs for filters
   useEffect(() => {
      debounceFilterUpdate(setLeaveRequestFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchUser, "search");
   }, [searchUser]);

   // Handle pagination page change
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

   // Filter form handling
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

   // Fetch user and leave requests data
   const { user, isLoading: userByIdLoading } = useUserById(parseInt(slug));
   const {
      userLeaveRequests,
      isLoading: leaveRequestLoading,
      mutate: leaveRequestMutate,
   } = useLeaveRequestsByUser(parseInt(slug), leaveRequestFilter);
   const { users, isLoading: userLoading } = useUsers(userFilter);

   // Selected leave request and user for modals
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

   // Reset form when selected leave request changes
   useEffect(() => {
      setSelectedUser(selectedLeaveRequest?.leaveUser || null);
      reset({
         userId: selectedLeaveRequest?.userId?.toString() ?? "",
         startDate: selectedLeaveRequest?.startDate ?? "",
         endDate: selectedLeaveRequest?.endDate ?? "",
         leaveType: selectedLeaveRequest?.leaveType ?? "",
         status: selectedLeaveRequest?.status ?? "",
         reason: selectedLeaveRequest?.reason ?? "",
         approverId: selectedLeaveRequest?.approverId
            ? selectedLeaveRequest?.approverId.toString()
            : "",
         approvalNotes: selectedLeaveRequest?.approvalNotes ?? "",
      });
   }, [selectedLeaveRequest, reset]);

   // Reset form and set selected user when user data loads
   useEffect(() => {
      if (user) {
         setSelectedUser(user.data);
         reset({
            userId: user?.data.id,
            startDate: "",
            endDate: "",
            leaveType: "",
            status: "",
            reason: "",
            approverId: "",
            approvalNotes: "",
         });
      }
   }, [user, reset]);

   // Modal management
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedLeaveRequest,
      () => reset(leaveRequestDefaultValues)
   );

   // Leave request CRUD actions
   const {
      handleAction,
      isCreating,
      isDeleting,
      isUpdating,
      isApproving,
      isRejecting,
   } = useLeaveRequestAction(leaveRequestMutate, closeModal, setError);

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Header with back button and user name */}
         <HeaderTitle
            title={userByIdLoading ? "Loading..." : user?.data?.fullName}
            showBackButton
            navigateTo="/administrator/izin"
            className="py-2"
         />

         {/* Toolbar with search and filter/add buttons */}
         <AdminTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
         />

         {/* Leave request table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <LeaveRequestTable
               leaveRequests={userLeaveRequests?.data}
               leaveRequestLoading={leaveRequestLoading}
               openModal={openModal}
               columnVisibility={{ leaveUser: false }}
            />
         </div>

         {/* Modals for leave request add/edit/delete/detail */}
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
            totalPages={userLeaveRequests?.pagination?.totalPages ?? 1}
            currentPage={userLeaveRequests?.pagination?.currentPage ?? 1}
            hasNextPage={userLeaveRequests?.pagination?.hasNextPage ?? false}
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
