import React from "react";

export default function ProfileInfo({
   label,
   value,
}: Readonly<{
   label: string;
   value: string | undefined;
}>) {
   return (
      <div className="flex flex-col p-4 bg-white border-b border-gray-200">
         <div className="text-gray-400 font-light">{label}</div>
         <div className="text-black font-light">{value || "---"}</div>
      </div>
   );
}
