import React from "react";

export default function ProfileInfo({
   label,
   value,
}: {
   label: string;
   value: string | undefined;
}) {
   return (
      <div className="flex flex-col py-2 border-b border-gray-200">
         <div className="text-gray-400 font-light">{label}</div>
         <div className="text-black font-light">{value || "---"}</div>
      </div>
   );
}
