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
   const { all, approved, rejected, canceled, pending } = useUserLeaveRequests(
      user?.id
   );
   const [activeFilter, setActiveFilter] = useState<LeaveFilterType>("all");

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
         <section className="flex justify-between items-center px-4 pt-6">
            <HeaderTitle title="Pengajuan Izin" />
            <button
               onClick={() => router.push("/me/izin/add")}
               className="p-2 rounded-lg border bg-white border-gray-400 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >
               <FontAwesomeIcon icon={faPlus} />
            </button>
         </section>

         <section className="px-4 mt-6 grid grid-cols-2 gap-4">
            <LeaveDashboardCard
               count={all.userLeaveRequests?.pagination?.totalItems || 0}
               label="Total Izin"
               bgColor="bg-blue-200"
               borderColor="border-blue-400"
            />
            <LeaveDashboardCard
               count={approved.userLeaveRequests?.pagination?.totalItems || 0}
               label="Disetujui"
               bgColor="bg-green-200"
               borderColor="border-green-400"
            />
            <LeaveDashboardCard
               count={rejected.userLeaveRequests?.pagination?.totalItems || 0}
               label="Ditolak"
               bgColor="bg-red-200"
               borderColor="border-red-400"
            />
            <LeaveDashboardCard
               count={canceled.userLeaveRequests?.pagination?.totalItems || 0}
               label="Dibatalkan"
               bgColor="bg-amber-200"
               borderColor="border-amber-400"
            />
         </section>

         <section className="px-4 mt-6">
            <div className="font-semibold mb-2">Riwayat Pengajuan Izin</div>
            <LeaveRequestFilter
               activeFilter={activeFilter}
               onChange={setActiveFilter}
            />
            <LeaveRequestList
               requests={filteredRequests?.data || []}
               isLoading={all.isLoading}
               showLimit={3}
               onViewAll={() => router.push("/me/izin/all")}
               refetchAll={refetchAll}
            />
         </section>
      </>
   );
}
