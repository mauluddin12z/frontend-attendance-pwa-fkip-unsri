"use client";
import LeaveRequestList from "@/components/ui/Leave/LeaveRequestList";
import LeaveRequestFilter, {
   LeaveFilterType,
} from "@/components/ui/Leave/LeaveRequestFilter";
import { useAuth } from "@/context/AuthContext";
import { useState, useMemo } from "react";
import { useUserLeaveRequests } from "@/hooks/leave-request";
import Pagination from "@/components/ui/Pagination";
import HeaderTitle from "@/components/ui/HeaderTitle";

export default function LeaveAllPage() {
   const { user } = useAuth();

   const pageSize = 10;
   const [page, setPage] = useState(1);
   const { all, approved, rejected, canceled, pending } = useUserLeaveRequests(
      user?.id,
      page,
      pageSize
   );
   const [activeFilter, setActiveFilter] = useState<LeaveFilterType>("all");

   // Memoizing loading state to prevent unnecessary recomputations
   const isLoading = useMemo(
      () =>
         all.isLoading ||
         approved.isLoading ||
         rejected.isLoading ||
         canceled.isLoading ||
         pending.isLoading,
      [
         all.isLoading,
         approved.isLoading,
         rejected.isLoading,
         canceled.isLoading,
         pending.isLoading,
      ]
   );

   // Function to get filtered leave requests based on filter type
   const getFilteredRequests = () => {
      switch (activeFilter) {
         case "all":
            return all.userLeaveRequests;
         case "approved":
            return approved.userLeaveRequests;
         case "rejected":
            return rejected.userLeaveRequests;
         case "canceled":
            return canceled.userLeaveRequests;
         case "pending":
            return pending.userLeaveRequests;
         default:
            return [];
      }
   };

   const filteredRequests = useMemo(
      () => getFilteredRequests(),
      [
         all.userLeaveRequests,
         activeFilter,
         approved.userLeaveRequests,
         rejected.userLeaveRequests,
         canceled.userLeaveRequests,
         pending.userLeaveRequests,
      ]
   );

   const refetchAll = async () => {
      await Promise.all([
         all.mutate(),
         approved.mutate(),
         rejected.mutate(),
         canceled.mutate(),
      ]);
   };

   return (
      <>
         {/* Header */}
         <HeaderTitle
            title="Semua Pengajuan Izin"
            showBackButton={true}
            navigateTo="/me/izin"
            className="px-4 pt-6"
         />

         <section className="px-4 mt-6">
            <div className="font-semibold mb-2">Riwayat Pengajuan Izin</div>
            <LeaveRequestFilter
               activeFilter={activeFilter}
               onChange={setActiveFilter}
            />
            <LeaveRequestList
               requests={filteredRequests?.data || []}
               isLoading={isLoading}
               refetchAll={refetchAll}
            />
         </section>

         {/* Pagination Section */}
         <section className="mt-2">
            <Pagination
               currentPage={page}
               hasNextPage={filteredRequests?.pagination?.hasNextPage || false}
               onPageChange={setPage}
               totalPages={filteredRequests?.pagination?.totalPages || 1}
               isLoading={isLoading}
            />
         </section>
      </>
   );
}
