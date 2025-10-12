import React from "react";

export default function page() {
   return (
      <div className="w-full h-screen flex justify-center items-center">
         <div className="flex flex-col text-center">
            <h1 className="text-2xl font-bold">403 - Unauthorized</h1>
            <p>You don’t have permission to access this page.</p>
         </div>
      </div>
   );
}
