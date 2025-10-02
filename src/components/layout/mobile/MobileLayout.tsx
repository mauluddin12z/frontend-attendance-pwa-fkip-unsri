"use client";

import React, { useEffect } from "react";
import BottomNavigationBar from "./BottomNavigationBar";
import { useDevice } from "@/context/DeviceContext";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function MobileLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const { isMobileDevice } = useDevice();
   const router = useRouter();

   // Wait for detection to complete before redirecting
   useEffect(() => {
      if (isMobileDevice === false) {
         router.replace("/home");
      }
   }, [isMobileDevice, router]);

   // Show loader while detecting
   if (isMobileDevice === null) {
      return <Loading />;
   }

   // Render for mobile devices
   return (
      <div className="w-full min-h-screen flex flex-col bg-[#F7F7F7]">
         <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-24">
            {children}
         </div>
         <BottomNavigationBar />
      </div>
   );
}
