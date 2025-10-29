"use client";

import React, { useState } from "react";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import Pagination from "@/components/ui/Pagination";
import { useAuditLogs } from "@/hooks/audit-log"; // Your hook to fetch audit logs
import AuditLogTable from "@/components/ui/AuditLogs/AuditLogTable";
import { useAdministratorModal } from "@/hooks/misc";
import { useForm } from "react-hook-form";
import AuditLogFilterModal from "@/components/ui/AuditLogs/AuditLogFilterModal";
import Modal from "@/components/ui/Modal/Modal";
import { AuditLog } from "@/types";

export default function Page() {
   const [filter, setFilter] = useState({
      fields: null,
      sortBy: "createdAt",
      order: "DESC",
      search: "",
      action: "",
      startDate: "",
      endDate: "",
      page: 1,
   });

   const handlePageChange = (page: number) => {
      setFilter((prev) => ({ ...prev, page }));
   };

   // Apply the filters to the global state or parent component
   const applyFilters = (data: any) => {
      setFilter((prev: any) => ({
         ...prev,
         action: data.action,
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
         startDate: "",
         endDate: "",
         action: "",
      },
   });

   const { auditLogs, isLoading } = useAuditLogs(filter);

   const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

   // Modal state & control
   const { modalState, openModal, closeModal } =
      useAdministratorModal(setSelectedLog);

   return (
      <>
         <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
            <AdminTableToolbar
               searchQuery={filter.search}
               setSearchQuery={(search) =>
                  setFilter((prev) => ({ ...prev, search, page: 1 }))
               }
               openModalFilter={() => openModal(undefined, "filter")}
               openModalAdd={() => {}}
               columnVisibility={{ search: false }}
            />

            <div className="relative overflow-x-auto sm:rounded-lg">
               <AuditLogTable
                  auditLogs={auditLogs?.data}
                  auditLogLoading={isLoading}
                  openModal={openModal}
               />
            </div>

            <Pagination
               totalPages={auditLogs?.pagination?.totalPages ?? 1}
               currentPage={auditLogs?.pagination?.currentPage ?? 1}
               hasNextPage={auditLogs?.pagination?.hasNextPage ?? false}
               isLoading={isLoading}
               onPageChange={handlePageChange}
            />

            {/* Filter modal for AuditLog list filtering */}
            {modalState.isFilterModalOpen && (
               <AuditLogFilterModal
                  isOpen={modalState.isFilterModalOpen}
                  closeModal={closeModal}
                  filterRegister={filterRegister}
                  handleFilterSubmit={handleFilterSubmit}
                  filterSetValue={filterSetValue}
                  applyFilters={applyFilters}
               />
            )}
         </div>
         {modalState.isDetailModalOpen && (
            <Modal
               isOpen={modalState.isDetailModalOpen}
               closeModal={closeModal}
               isFooter={false}
               modalTitle={"Details"}
            >
               <div className="p-4">
                  <pre className="whitespace-pre-wrap break-words text-xs text-gray-700 rounded-lg border border-gray-200 p-8">
                     {selectedLog?.details
                        ? JSON.stringify(selectedLog?.details, null, 2)
                        : "-"}
                  </pre>
               </div>
            </Modal>
         )}
      </>
   );
}
