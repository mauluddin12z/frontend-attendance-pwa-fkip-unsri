"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import Pagination from "@/components/ui/Pagination";
import UserModals from "@/components/ui/User/UserModals";
import UserTable from "@/components/ui/User/UserTable";

import { useAdministratorModal } from "@/hooks/misc";
import { useRoles, useUserAction, useUsers } from "@/hooks/user";

import { User, UserForm } from "@/types";
import { debounceFilterUpdate } from "@/utils/debounce";

export default function Page() {
   // State for search input and user filters
   const [searchQuery, setSearchQuery] = useState("");
   const [userFilter, setUserFilter] = useState({
      fields: null,
      sortBy: "createdAt",
      order: "DESC",
      search: "",
   });

   // Debounce search input to update filter
   useEffect(() => {
      debounceFilterUpdate(setUserFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   // Handle pagination page change
   const handlePageChange = (page: number) => {
      setUserFilter((prev) => ({ ...prev, page }));
   };

   // Fetch users and roles data
   const {
      users,
      isLoading: userLoading,
      mutate: userMutate,
   } = useUsers(userFilter);
   const { roles, isLoading: roleLoading } = useRoles();

   // Selected user for modals
   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   // Default form values
   const userDefaultValues: UserForm = {
      roleId: "",
      fullName: "",
      nip: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isActive: "",
      deviceId: "",
   };

   // Form handling for user add/edit
   const {
      register,
      watch,
      setValue,
      control,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
   } = useForm<UserForm>({
      mode: "onTouched",
      defaultValues: userDefaultValues,
   });

   // Reset form when selected user changes
   useEffect(() => {
      reset({
         roleId: selectedUser?.roleId?.toString() ?? "",
         fullName: selectedUser?.fullName ?? "",
         nip: selectedUser?.nip ?? "",
         email: selectedUser?.email ?? "",
         phoneNumber: selectedUser?.phoneNumber ?? "",
         password: "",
         confirmPassword: "",
         isActive: selectedUser?.isActive?.toString() ?? "",
         deviceId: selectedUser?.deviceId?.toString() ?? "",
      });
   }, [selectedUser, reset]);

   // Modal management hooks
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedUser,
      () => reset(userDefaultValues)
   );

   // User CRUD actions
   const { handleAction, isCreating, isDeleting, isUpdating } = useUserAction(
      userMutate,
      closeModal,
      setError
   );

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Toolbar with search and add/filter buttons */}
         <AdminTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
            columnVisibility={{ filter: false }}
         />

         {/* User table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <UserTable
               users={users?.data}
               userLoading={userLoading}
               openModal={openModal}
            />
         </div>

         {/* Pagination */}
         <Pagination
            totalPages={users?.pagination?.totalPages ?? 1}
            currentPage={users?.pagination?.currentPage ?? 1}
            hasNextPage={users?.pagination?.hasNextPage ?? false}
            isLoading={userLoading}
            onPageChange={handlePageChange}
         />

         {/* User modals for add/edit/delete/detail */}
         <UserModals
            modalState={modalState}
            closeModal={closeModal}
            handleDelete={() => handleAction("delete", undefined, selectedUser)}
            handleSubmit={handleSubmit}
            handleEdit={(data: UserForm) =>
               handleAction("edit", data, selectedUser)
            }
            handleAdd={(data: UserForm) => handleAction("add", data)}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            selectedUser={selectedUser!}
            roles={roles?.data}
            roleLoading={roleLoading}
            errors={errors}
            register={register}
            setValue={setValue}
            control={control}
            watch={watch}
         />
      </div>
   );
}
