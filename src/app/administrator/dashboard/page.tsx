"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import UserIcon from "@/assets/NavigationIcon/UserIcon";
import AttendanceIcon from "@/assets/NavigationIcon/AttendanceIcon";
import LeaveIcon from "@/assets/NavigationIcon/LeaveIcon";
import AttendanceTable from "@/components/ui/Attendance/AttendanceTable";
import SummaryCard from "@/components/ui/Dashboard/SummaryCard";
import { useAuth } from "@/context/AuthContext";
import { useAttendances } from "@/hooks/attendance";
import { useUsers } from "@/hooks/user";
import { useLeaveRequests } from "@/hooks/leave-request";
import customMoment from "@/utils/customMoment";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import { LeaveRequest } from "@/types";
import SectionCard from "@/components/ui/SectionCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

export default function DashboardPage() {
   const { user, isLoading: userLoading } = useAuth();
   const [timeFilter, setTimeFilter] = useState("Hari ini");

   // --- Time filter options ---
   const timeOptions = [
      { value: "Hari ini", label: "Hari ini" },
      { value: "Minggu ini", label: "Minggu ini" },
      { value: "Bulan ini", label: "Bulan ini" },
      { value: "Tahun ini", label: "Tahun ini" },
   ];

   // --- Date range logic ---
   const { startDate, endDate, displayRange } = useMemo(() => {
      const today = customMoment();
      let start, end;

      switch (timeFilter) {
         case "Minggu ini":
            start = today.clone().startOf("week");
            end = today.clone().endOf("week");
            break;
         case "Bulan ini":
            start = today.clone().startOf("month");
            end = today.clone().endOf("month");
            break;
         case "Tahun ini":
            start = today.clone().startOf("year");
            end = today.clone().endOf("year");
            break;
         default:
            start = today;
            end = today;
      }

      return {
         startDate: start.format("YYYY-MM-DD"),
         endDate: end.format("YYYY-MM-DD"),
         displayRange: start.isSame(end, "day")
            ? start.format("DD MMMM YYYY")
            : `${start.format("DD MMMM")} - ${end.format("DD MMMM YYYY")}`,
      };
   }, [timeFilter]);

   // --- Data fetching ---
   const { users, isLoading: userDataLoading } = useUsers();
   const totalUsers = users?.data?.length ?? 0;

   const { attendances, isLoading: attendanceLoading } = useAttendances({
      startDate,
      endDate,
      include: "status,user",
   });

   const { attendances: presentAttendances, isLoading: presentLoading } =
      useAttendances({
         startDate,
         endDate,
         attendanceStatus: "hadir",
         include: "status,user",
      });
   const totalHadir = presentAttendances?.data?.length ?? 0;

   const { attendances: absentAttendances, isLoading: absentLoading } =
      useAttendances({
         startDate,
         endDate,
         attendanceStatus: "tidak hadir",
         include: "status,user",
      });
   const totalTidakHadir = absentAttendances?.data?.length ?? 0;

   const { leaveRequests, isLoading: leaveRequestLoading } = useLeaveRequests({
      status: "menunggu persetujuan",
      include: "leaveUser",
   });

   const {
      leaveRequests: approvedLeaveRequests,
      isLoading: approvedLeaveRequestLoading,
   } = useLeaveRequests({
      startDate,
      endDate,
      status: "disetujui",
      pageSize: 5,
   });
   const totalLeave = approvedLeaveRequests?.data?.length ?? 0;

   const isAttendanceDataEmpty =
      !attendanceLoading && attendances?.data?.length === 0;
   const isLeaveRequestDataEmpty =
      !leaveRequestLoading && leaveRequests?.data?.length === 0;

   // ================= RENDER =================
   return (
      <div className="p-2 sm:p-6 space-y-6">
         {/* HEADER */}
         <header className="border-b border-gray-200 pb-3">
            <h1 className="text-4xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
               Ringkasan aktivitas dan kehadiran Anda
            </p>
         </header>

         {/* WELCOME + FILTER */}
         <div className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white shadow-sm">
            <div>
               <div className="font-semibold text-lg text-gray-800">
                  {userLoading
                     ? "Memuat pengguna..."
                     : `Selamat datang, ${user?.fullName || "User"}`}
               </div>
               <div className="text-sm text-gray-500 mt-1">
                  Menampilkan data:{" "}
                  <span className="font-medium">{displayRange}</span>
               </div>
            </div>

            <select
               className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
               value={timeFilter}
               onChange={(e) => setTimeFilter(e.target.value)}
            >
               {timeOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                     {label}
                  </option>
               ))}
            </select>
         </div>

         {/* SUMMARY CARDS */}
         <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <SummaryCard
                  icon={<AttendanceIcon color="gray-600" />}
                  title="Total Hadir"
                  number={presentLoading ? "..." : totalHadir}
               />
               <SummaryCard
                  icon={<AttendanceIcon color="gray-600" />}
                  title="Tidak Hadir"
                  number={absentLoading ? "..." : totalTidakHadir}
               />
               <SummaryCard
                  icon={<UserIcon color="gray-600" />}
                  title="Total Pengguna"
                  number={userDataLoading ? "..." : totalUsers}
               />
               <SummaryCard
                  icon={<LeaveIcon color="gray-600" />}
                  title="Izin Disetujui"
                  number={approvedLeaveRequestLoading ? "..." : totalLeave}
               />
            </div>
         </section>

         {/* MAIN CONTENT GRID */}
         <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance table */}
            <SectionCard className="sm:col-span-2 relative overflow-x-auto ">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                     Kehadiran ({timeFilter})
                  </h2>
                  <Link
                     href="/administrator/absensi"
                     className="text-sm border border-gray-200 hover:bg-gray-100 transition rounded-lg px-3 py-1.5"
                  >
                     Lihat semua
                  </Link>
               </div>

               {attendanceLoading ? (
                  <LoadingState text="Memuat data kehadiran..." />
               ) : isAttendanceDataEmpty ? (
                  <EmptyState text="Tidak ada data kehadiran untuk periode ini." />
               ) : (
                  <AttendanceTable
                     attendances={attendances?.data || []}
                     attendanceLoading={attendanceLoading}
                     openModal={undefined}
                     columnVisibility={{ action: false, details: false }}
                  />
               )}
            </SectionCard>

            {/* Leave requests */}
            <SectionCard>
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                     Permintaan Izin ({timeFilter})
                  </h2>
                  <Link
                     href="/administrator/izin"
                     className="text-sm border border-gray-200 hover:bg-gray-100 transition rounded-lg px-3 py-1.5"
                  >
                     Lihat semua
                  </Link>
               </div>

               {leaveRequestLoading ? (
                  <LoadingState text="Memuat data izin..." />
               ) : isLeaveRequestDataEmpty ? (
                  <EmptyState text="Tidak ada data izin untuk periode ini." />
               ) : (
                  <div className="flex flex-col gap-3">
                     {leaveRequests?.data
                        ?.slice(0, 5)
                        .map((leaveRequest: LeaveRequest) => (
                           <div
                              key={leaveRequest.id}
                              className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition"
                           >
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                 <span>
                                    {formatDateTime(leaveRequest.createdAt)}
                                 </span>
                                 <span className="capitalize font-medium">
                                    {leaveRequest.status}
                                 </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-800">
                                 {leaveRequest.leaveUser?.fullName ||
                                    "Tanpa nama"}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                 {leaveRequest.leaveType} —{" "}
                                 {formatDate(leaveRequest.startDate)} s.d.{" "}
                                 {formatDate(leaveRequest.endDate)}
                              </p>
                              {leaveRequest.reason && (
                                 <p className="text-xs text-gray-500 mt-1 italic">
                                    “{leaveRequest.reason}”
                                 </p>
                              )}
                           </div>
                        ))}
                  </div>
               )}
            </SectionCard>
         </section>
      </div>
   );
}
