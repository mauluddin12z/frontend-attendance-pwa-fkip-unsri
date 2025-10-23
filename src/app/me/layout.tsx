"use client";

import React from "react";
import Loading from "@/app/loading";
import BottomNavigationBar from "@/components/layout/mobile/BottomNavigationBar";
import { useAuth } from "@/context/AuthContext";

export default function MobileLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const { isLoading: userLoading } = useAuth();

   if (userLoading) {
      return <Loading />;
   }

   return (
      <div className="w-full min-h-screen flex flex-col bg-[#F7F7F7]">
         <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-20">
            {children}
         </div>
         <BottomNavigationBar />
      </div>
   );
}
