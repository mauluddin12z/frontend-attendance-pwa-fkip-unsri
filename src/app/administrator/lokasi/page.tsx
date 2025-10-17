"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import Pagination from "@/components/ui/Pagination";
import { useAdministratorModal } from "@/hooks/misc";
import { Location, LocationForm } from "@/types";
import LocationTable from "@/components/ui/Location/LocationTable";
import LocationModals from "@/components/ui/Location/LocationModals";
import {
   useSettingsGeofenceAction,
   useSettingsGeofences,
} from "@/hooks/settings-geofence";

export default function Page() {
   const [locationFilter, setLocationFilter] = useState({
      fields: null,
      sortBy: "id",
      order: "ASC",
      search: "",
   });

   // Handle pagination
   const handlePageChange = (page: number) => {
      setLocationFilter((prev) => ({ ...prev, page }));
   };

   // Fetch locations
   const {
      settingsGeofences,
      isLoading: settingsGeofenceLoading,
      mutate: locationMutate,
   } = useSettingsGeofences(locationFilter);

   // Selected location for modals
   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
      null
   );

   // Default values
   const defaultValues: LocationForm = {
      name: "",
      latitude: "",
      longitude: "",
      radiusMeters: "",
      isActive: "true",
   };

   // Form setup
   const {
      register,
      watch,
      control,
      handleSubmit,
      setError,
      formState: { errors },
      reset,
   } = useForm<LocationForm>({
      mode: "onTouched",
      defaultValues,
   });

   // Reset form when selected location changes
   useEffect(() => {
      reset({
         name: selectedLocation?.name ?? "",
         latitude: selectedLocation?.latitude?.toString() ?? "0",
         longitude: selectedLocation?.longitude?.toString() ?? "0",
         radiusMeters: selectedLocation?.radiusMeters?.toString() ?? "0",
         isActive: selectedLocation?.isActive?.toString() ?? "true",
      });
   }, [selectedLocation, reset]);

   // Modal handling
   const { modalState, openModal, closeModal } = useAdministratorModal(
      setSelectedLocation,
      () => reset(defaultValues)
   );

   // CRUD actions
   const { handleAction, isCreating, isUpdating, isDeleting } =
      useSettingsGeofenceAction(locationMutate, closeModal, setError);

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Toolbar */}
         <AdminTableToolbar
            searchQuery={undefined}
            setSearchQuery={undefined}
            openModalFilter={() => openModal(undefined, "filter")}
            openModalAdd={() => openModal(undefined, "add")}
            columnVisibility={{ filter: false, search: false }}
         />

         {/* Table */}
         <div className="relative overflow-x-auto sm:rounded-lg">
            <LocationTable
               locations={settingsGeofences?.data}
               locationLoading={settingsGeofenceLoading}
               openModal={openModal}
            />
         </div>

         {/* Pagination */}
         <Pagination
            totalPages={settingsGeofences?.pagination?.totalPages ?? 1}
            currentPage={settingsGeofences?.pagination?.currentPage ?? 1}
            hasNextPage={settingsGeofences?.pagination?.hasNextPage ?? false}
            isLoading={settingsGeofenceLoading}
            onPageChange={handlePageChange}
         />

         {/* Modals */}
         <LocationModals
            modalState={modalState}
            closeModal={closeModal}
            handleDelete={() =>
               handleAction("delete", undefined, selectedLocation)
            }
            handleSubmit={handleSubmit}
            handleEdit={(data: LocationForm) =>
               handleAction("edit", data, selectedLocation)
            }
            handleAdd={(data: LocationForm) => handleAction("add", data)}
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
