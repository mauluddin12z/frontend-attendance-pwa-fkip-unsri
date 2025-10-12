import {
   faCreditCard,
   faUserCheck,
   faUserTimes,
   faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardCard from "../DashboardCard";
import React, { useState } from "react";

const cardStyles = {
   total: {
      label: "Total",
      icon: faCreditCard,
      cardColor: "bg-indigo-100",
      iconColor: "bg-indigo-600",
   },
   hadir: {
      label: "Hadir",
      icon: faUserCheck,
      cardColor: "bg-green-100",
      iconColor: "bg-green-600",
   },
   izin: {
      label: "Izin",
      icon: faUserClock,
      cardColor: "bg-yellow-100",
      iconColor: "bg-yellow-600",
   },
   tidakHadir: {
      label: "Tidak Hadir",
      icon: faUserTimes,
      cardColor: "bg-red-100",
      iconColor: "bg-red-600",
   },
   terlambat: {
      label: "Terlambat",
      icon: faUserClock,
      cardColor: "bg-orange-100",
      iconColor: "bg-orange-600",
   },
   pulangAwal: {
      label: "Pulang Awal",
      icon: faUserClock,
      cardColor: "bg-orange-100",
      iconColor: "bg-orange-600",
   },
   terlambatPulangAwal: {
      label: "Terlambat & Pulang Awal",
      icon: faUserClock,
      cardColor: "bg-orange-100",
      iconColor: "bg-orange-600",
   },
   tidakAdaCheckOut: {
      label: "Tidak melakukan Check-out",
      icon: faUserClock,
      cardColor: "bg-orange-100",
      iconColor: "bg-orange-600",
   },
};

// First main card
const mainSummaryCards = [
   { key: "all", styleKey: "total" },
   { key: "hadir", styleKey: "hadir" },
   { key: "izin", styleKey: "izin" },
   { key: "tidakHadir", styleKey: "tidakHadir" },
];

// Detail card
const detailSummaryCards = [
   { key: "terlambat", styleKey: "terlambat" },
   { key: "pulangAwal", styleKey: "pulangAwal" },
   { key: "terlambatPulangAwal", styleKey: "terlambatPulangAwal" },
   { key: "tidakAdaCheckOut", styleKey: "tidakAdaCheckOut" },
];

export default function AttendanceSummaryCardList({
   summary,
   summaryLoading,
}: Readonly<{
   summary: any;
   summaryLoading: boolean;
}>) {
   const [showDetail, setShowDetail] = useState(false);

   const toggleDetail = () => setShowDetail((prev) => !prev);

   return (
      <div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {mainSummaryCards.map(({ key, styleKey }) => {
               const style = cardStyles[styleKey as keyof typeof cardStyles];
               return (
                  <DashboardCard
                     key={key}
                     icon={<FontAwesomeIcon icon={style.icon} size="lg" />}
                     data={summary?.[key]}
                     isLoading={summaryLoading}
                     label={style.label}
                     cardColor={style.cardColor}
                     iconColor={style.iconColor}
                  />
               );
            })}

            {showDetail &&
               detailSummaryCards.map(({ key, styleKey }) => {
                  const style = cardStyles[styleKey as keyof typeof cardStyles];
                  return (
                     <DashboardCard
                        key={key}
                        icon={<FontAwesomeIcon icon={style.icon} size="lg" />}
                        data={summary?.[key]}
                        isLoading={summaryLoading}
                        label={style.label}
                        cardColor={style.cardColor}
                        iconColor={style.iconColor}
                     />
                  );
               })}
         </div>

         <div className="flex justify-center">
            <button
               onClick={toggleDetail}
               className="text-sm text-blue-600 hover:underline mb-4 cursor-pointer"
            >
               {showDetail ? "Sembunyikan Detail" : "Tampilkan Detail"}
            </button>
         </div>
      </div>
   );
}
