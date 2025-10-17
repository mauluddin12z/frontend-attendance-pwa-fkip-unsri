"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import Pagination from "@/components/ui/Pagination";
import { useAdministratorModal } from "@/hooks/misc";
import { Holiday, HolidayForm } from "@/types";
import { debounceFilterUpdate } from "@/utils/debounce";
import { useHolidayAction, useHolidays } from "@/hooks/holiday";
import HolidayModals from "@/components/ui/Holiday/HolidayModals";
import HolidayTable from "@/components/ui/Holiday/HolidayTable";

export default function Page() {
   // State for search input and holiday filters
   const [searchQuery, setSearchQuery] = useState("");
   const [holidayFilter, setHolidayFilter] = useState({
      fields: null,
      sortBy: "id",
      order: "ASC",
      search: "",
   });

   // Debounce search input to update filter
   useEffect(() => {
      debounceFilterUpdate(setHolidayFilter, 300)(searchQuery, "search");
   }, [searchQuery]);

   // Handle pagination page change
   const handlePageChange = (page: number) => {
      setHolidayFilter((prev) => ({ ...prev, page }));
   };

   // Fetch holidays data
   const {
      holidays,
      isLoading: holidayLoading,
      mutate: holidayMutate,
   } = useHolidays(holidayFilter);

   // Selected holiday for modals
   const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

   // Default form values
   const defaultValues: HolidayForm = {
      name: "",
      date: "",
      description: "",
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
   } = useForm<HolidayForm>({
      mode: "onTouched",
      defaultValues: defaultValues,
   });

   // Reset form when selected holiday changes
   useEffect(() => {
      reset({
         name: selectedHoliday?.name ?? "",
         date: selectedHoliday?.date ?? "",
         description: selectedHoliday?.description ?? "",
      });
   }, [selectedHoliday, reset]);

   // Modal management hooks
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedHoliday,
      () => reset(defaultValues)
   );

   // Holiday CRUD actions
   const { handleAction, isCreating, isDeleting, isUpdating } =
      useHolidayAction(holidayMutate, closeModal, setError);

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

         {/* Holiday table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <HolidayTable
               holidays={holidays?.data}
               holidayLoading={holidayLoading}
               openModal={openModal}
            />
         </div>

         {/* Pagination */}
         <Pagination
            totalPages={holidays?.pagination?.totalPages ?? 1}
            currentPage={holidays?.pagination?.currentPage ?? 1}
            hasNextPage={holidays?.pagination?.hasNextPage ?? false}
            isLoading={holidayLoading}
            onPageChange={handlePageChange}
         />

         {/* Holiday modals for add/edit/delete */}
         <HolidayModals
            modalState={modalState}
            closeModal={closeModal}
            handleDelete={() =>
               handleAction("delete", undefined, selectedHoliday)
            }
            handleSubmit={handleSubmit}
            handleEdit={(data: HolidayForm) =>
               handleAction("edit", data, selectedHoliday)
            }
            handleAdd={(data: HolidayForm) => handleAction("add", data)}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            errors={errors}
            register={register}
            control={control}
            watch={watch}
         />
      </div>
   );
}
