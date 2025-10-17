"use client";

import React, { use, useEffect, useState } from "react";
import AdminTableToolbar from "@/components/ui/AdminTableToolbar";
import Pagination from "@/components/ui/Pagination";
import { AuditLog } from "@/types";
import { useAuditLogs } from "@/hooks/audit-log"; // Your hook to fetch audit logs
import AuditLogTable from "@/components/ui/AuditLogs/AuditLogTable";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { useUserById } from "@/hooks/user";

interface PageProps {
   params: Promise<{ slug: string }>;
}

export default function Page({ params }: Readonly<PageProps>) {
   // Extract URL params
   const { slug } = use(params);

   const [filter, setFilter] = useState({
      fields: null,
      sortBy: "createdAt",
      order: "DESC",
      search: "",
      page: 1,
   });

   const handlePageChange = (page: number) => {
      setFilter((prev) => ({ ...prev, page }));
   };

   const { auditLogs, isLoading } = useAuditLogs({
      ...filter,
      userId: parseInt(slug),
   });

   const { user, isLoading: userByIdLoading } = useUserById(parseInt(slug));

   return (
      <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-lg">
         {/* Header with back button and user name */}
         <HeaderTitle
            title={userByIdLoading ? "Loading..." : user?.data?.fullName}
            showBackButton
            navigateTo="/administrator/logs"
            className="py-2"
         />

         <AdminTableToolbar
            searchQuery={filter.search}
            setSearchQuery={(search) =>
               setFilter((prev) => ({ ...prev, search, page: 1 }))
            }
            openModalFilter={() => {}}
            openModalAdd={() => {}}
            columnVisibility={{ filter: false, search: false }}
         />

         <div className="relative overflow-x-auto sm:rounded-lg">
            <AuditLogTable
               auditLogs={auditLogs?.data}
               auditLogLoading={isLoading}
            />
         </div>

         <Pagination
            totalPages={auditLogs?.pagination?.totalPages ?? 1}
            currentPage={auditLogs?.pagination?.currentPage ?? 1}
            hasNextPage={auditLogs?.pagination?.hasNextPage ?? false}
            isLoading={isLoading}
            onPageChange={handlePageChange}
         />
      </div>
   );
}
