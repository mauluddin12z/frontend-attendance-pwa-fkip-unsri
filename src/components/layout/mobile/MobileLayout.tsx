import React from "react";
import BottomNavigationBar from "./BottomNavigationBar";

export default function MobileLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div className="w-full min-h-screen flex flex-col bg-[#F7F7F7]">
         <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-24">
            {children}
         </div>
         <BottomNavigationBar />
      </div>
   );
}
