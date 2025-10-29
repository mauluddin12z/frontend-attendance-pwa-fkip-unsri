"use client";

import React from "react";
import NavigationButton from "./NavigationButton";
import { useRouter } from "next/navigation";

type HeaderTitleProps = {
   title: string;
   showBackButton?: boolean;
   backButtonBgColor?: string;
   backButtonBorderColor?: string;
   navigateTo?: string;
   className?: string;
};

export default function HeaderTitle({
   title,
   showBackButton = false,
   backButtonBgColor,
   backButtonBorderColor,
   navigateTo = "/",
   className = "",
}: Readonly<HeaderTitleProps>) {
   const router = useRouter();

   const handleBack = () => {
      if (navigateTo) {
         router.push(navigateTo);
      } else {
         router.back();
      }
   };

   return (
      <div className={`flex items-center space-x-2 ${className}`}>
         {showBackButton && (
            <NavigationButton
               direction="prev"
               onClick={handleBack}
               bgColor={backButtonBgColor}
               borderColor={backButtonBorderColor}
            />
         )}
         <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
   );
}
