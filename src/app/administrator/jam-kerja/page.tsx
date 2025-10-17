"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import Pagination from "@/components/ui/Pagination";
import { useAdministratorModal } from "@/hooks/misc";
import { WorkingHour, WorkingHourForm } from "@/types";
import { debounceFilterUpdate } from "@/utils/debounce";
import { useWorkingHourAction, useWorkingHours } from "@/hooks/working-hour";
import WorkingHourTable from "@/components/ui/Working-hour/WorkingHourTable";
import WorkingHourModals from "@/components/ui/Working-hour/WorkingHourModals";

export default function Page() {
   // State for search input and workingHour filters
   const [workingHourFilter, setWorkingHourFilter] = useState({
      fields: null,
      sortBy: "id",
      order: "ASC",
      search: "",
   });

   // Handle pagination page change
   const handlePageChange = (page: number) => {
      setWorkingHourFilter((prev) => ({ ...prev, page }));
   };

   // Fetch working hours data
   const {
      workingHours,
      isLoading: workingHourLoading,
      mutate: workingHourMutate,
   } = useWorkingHours(workingHourFilter);

   // Selected workingHour for modals
   const [selectedWorkingHour, setSelectedWorkingHour] =
      useState<WorkingHour | null>(null);

   // Default form values
   const defaultValues: WorkingHourForm = {
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      gracePeriodMinutes: "",
      isActive: "",
   };

   // Form handling for add/edit
   const {
      register,
      watch,
      control,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
   } = useForm<WorkingHourForm>({
      mode: "onTouched",
      defaultValues: defaultValues,
   });

   // Reset form when selected working hour changes
   useEffect(() => {
      reset({
         dayOfWeek: selectedWorkingHour?.dayOfWeek ?? "",
         startTime: selectedWorkingHour?.startTime ?? "",
         endTime: selectedWorkingHour?.endTime ?? "",
         gracePeriodMinutes: selectedWorkingHour?.gracePeriodMinutes ?? "",
         isActive: selectedWorkingHour?.isActive.toString() ?? "",
      });
   }, [selectedWorkingHour, reset]);

   // Modal management hooks
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedWorkingHour,
      () => reset(defaultValues)
   );

   // WorkingHour CRUD actions
   const { handleAction, isCreating, isDeleting, isUpdating } =
      useWorkingHourAction(workingHourMutate, closeModal, setError);

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Toolbar with search and add/filter buttons */}
         <AdminTableToolbar
            searchQuery={undefined}
            setSearchQuery={undefined}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
            columnVisibility={{ filter: false, search: false }}
         />

         {/* Working hour table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <WorkingHourTable
               workingHours={workingHours?.data}
               workingHourLoading={workingHourLoading}
               openModal={openModal}
            />
         </div>

         {/* Pagination */}
         <Pagination
            totalPages={workingHours?.pagination?.totalPages ?? 1}
            currentPage={workingHours?.pagination?.currentPage ?? 1}
            hasNextPage={workingHours?.pagination?.hasNextPage ?? false}
            isLoading={workingHourLoading}
            onPageChange={handlePageChange}
         />

         {/* Working Hour modals for add/edit/delete */}
         <WorkingHourModals
            modalState={modalState}
            closeModal={closeModal}
            handleDelete={() =>
               handleAction("delete", undefined, selectedWorkingHour)
            }
            handleSubmit={handleSubmit}
            handleEdit={(data: WorkingHourForm) =>
               handleAction("edit", data, selectedWorkingHour)
            }
            handleAdd={(data: WorkingHourForm) => handleAction("add", data)}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            errors={errors}
            register={register}
            watch={watch}
         />
      </div>
   );
}
