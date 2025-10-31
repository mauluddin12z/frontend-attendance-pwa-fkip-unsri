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
   const { all, approved, rejected, cancelled, pending } = useUserLeaveRequests(
      user?.id,
      page,
      pageSize
   );
   const [activeFilter, setActiveFilter] = useState<LeaveFilterType>("semua");

   // Memoizing loading state to prevent unnecessary recomputations
   const isLoading = useMemo(
      () =>
         all.isLoading ||
         approved.isLoading ||
         rejected.isLoading ||
         cancelled.isLoading ||
         pending.isLoading,
      [
         all.isLoading,
         approved.isLoading,
         rejected.isLoading,
         cancelled.isLoading,
         pending.isLoading,
      ]
   );

   // Function to get filtered leave requests based on filter type
   const getFilteredRequests = () => {
      switch (activeFilter) {
         case "semua":
            return all.userLeaveRequests;
         case "disetujui":
            return approved.userLeaveRequests;
         case "ditolak":
            return rejected.userLeaveRequests;
         case "dibatalkan":
            return cancelled.userLeaveRequests;
         case "menunggu persetujuan":
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
         cancelled.userLeaveRequests,
         pending.userLeaveRequests,
      ]
   );

   const refetchAll = async () => {
      await Promise.all([
         all.mutate(),
         approved.mutate(),
         rejected.mutate(),
         cancelled.mutate(),
      ]);
   };

   return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-10">
         {/* Header */}
         <section className="flex flex-col gap-x-2 pt-8 px-6">
            <HeaderTitle
               title="Semua Pengajuan Izin"
               showBackButton={true}
               navigateTo="/me/izin"
               backButtonBgColor="border border-gray-200"
            />
            <p className="mt-4 text-sm text-gray-600">
               Lihat dan kelola seluruh riwayat pengajuan izin Anda
            </p>
         </section>

         <section className="px-4 mt-8">
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
         <section className="mt-6">
            <Pagination
               currentPage={page}
               hasNextPage={filteredRequests?.pagination?.hasNextPage || false}
               onPageChange={setPage}
               totalPages={filteredRequests?.pagination?.totalPages || 1}
               isLoading={isLoading}
            />
         </section>
      </div>
   );
}
