"use client";
import { useState, useEffect } from "react";
import customMoment from "@/utils/customMoment";
import { UseFormSetValue } from "react-hook-form";

export type QuickFilterType = "today" | "thisMonth" | "thisYear" | null;

export function useQuickDateFilter(setValue: UseFormSetValue<any>) {
   const [quickFilter, setQuickFilter] = useState<QuickFilterType>(null);
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");

   const getDateRange = (type: Exclude<QuickFilterType, null>) => {
      switch (type) {
         case "today":
            return {
               start: customMoment().startOf("day").format("YYYY-MM-DD"),
               end: customMoment().endOf("day").format("YYYY-MM-DD"),
            };
         case "thisMonth":
            return {
               start: customMoment().startOf("month").format("YYYY-MM-DD"),
               end: customMoment().endOf("month").format("YYYY-MM-DD"),
            };
         case "thisYear":
            return {
               start: customMoment().startOf("year").format("YYYY-MM-DD"),
               end: customMoment().endOf("year").format("YYYY-MM-DD"),
            };
      }
   };

   const applyQuickFilter = (type: Exclude<QuickFilterType, null>) => {
      const { start, end } = getDateRange(type);
      setStartDate(start); // 'YYYY-MM-DD'
      setEndDate(end); // 'YYYY-MM-DD'
      setQuickFilter(type);
   };

   const handleStartDateChange = (date: string) => {
      setStartDate(date); // 'YYYY-MM-DD'
      setQuickFilter(null); // Clear quick filter selection
      setValue("startDate", date); // Set the date part in the form
   };

   const handleEndDateChange = (date: string) => {
      setEndDate(date); // 'YYYY-MM-DD'
      setQuickFilter(null); // Clear quick filter selection
      setValue("endDate", date); // Set the date part in the form
   };

   useEffect(() => {
      setValue("startDate", startDate); // Sync form value with startDate
      setValue("endDate", endDate); // Sync form value with endDate
   }, [startDate, endDate, setValue]);

   return {
      quickFilter,
      startDate,
      endDate,
      applyQuickFilter,
      handleStartDateChange,
      handleEndDateChange,
   };
}
