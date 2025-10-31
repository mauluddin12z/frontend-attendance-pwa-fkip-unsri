"use client";

import LeaveDashboardCard from "@/components/ui/Leave/LeaveDashboardCard";
import LeaveRequestFilter, {
   LeaveFilterType,
} from "@/components/ui/Leave/LeaveRequestFilter";
import LeaveRequestList from "@/components/ui/Leave/LeaveRequestList";
import { useAuth } from "@/context/AuthContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { useUserLeaveRequests } from "@/hooks/leave-request";

export default function LeaveDashboardPage() {
   const { user } = useAuth();
   const router = useRouter();
   const { all, approved, rejected, cancelled, pending } = useUserLeaveRequests(
      user?.id
   );
   const [activeFilter, setActiveFilter] = useState<LeaveFilterType>("semua");

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
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-10">
         {/* Header */}
         <section className="flex justify-between items-center px-6 pt-8 pb-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
            <HeaderTitle title="Pengajuan Izin" className="text-gray-900" />
            <button
               onClick={() => router.push("/me/izin/add")}
               className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-black font-medium rounded-lg hover:bg-gray-200 shadow-sm hover:shadow-lg transition-all"
            >
               <FontAwesomeIcon icon={faPlus} />
               <span className="hidden sm:inline">Buat Pengajuan</span>
            </button>
         </section>

         {/* Dashboard Cards */}
         <section className="px-6 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-5">
            <LeaveDashboardCard
               count={all.userLeaveRequests?.pagination?.totalItems || 0}
               label="Total Izin"
               gradient="from-blue-400 to-indigo-600"
            />
            <LeaveDashboardCard
               count={approved.userLeaveRequests?.pagination?.totalItems || 0}
               label="Disetujui"
               gradient="from-green-400 to-emerald-600"
            />
            <LeaveDashboardCard
               count={rejected.userLeaveRequests?.pagination?.totalItems || 0}
               label="Ditolak"
               gradient="from-red-400 to-rose-600"
            />
            <LeaveDashboardCard
               count={cancelled.userLeaveRequests?.pagination?.totalItems || 0}
               label="Dibatalkan"
               gradient="from-amber-400 to-yellow-600"
            />
         </section>

         {/* Leave History */}
         <section className="px-6 mt-12">
            <div className="flex justify-between items-center mb-4">
               <h2 className="font-semibold text-gray-800 text-lg">
                  Riwayat Pengajuan Izin
               </h2>
            </div>

            <LeaveRequestFilter
               activeFilter={activeFilter}
               onChange={setActiveFilter}
            />

            <div className="mt-6">
               <LeaveRequestList
                  requests={filteredRequests?.data || []}
                  isLoading={all.isLoading}
                  showLimit={3}
                  onViewAll={() => router.push("/me/izin/all")}
                  refetchAll={refetchAll}
               />
            </div>
         </section>
      </div>
   );
}
