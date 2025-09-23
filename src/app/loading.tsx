import React from "react";

export default function Loading() {
   return (
      <div className="z-[999] w-screen h-screen flex items-center justify-center bg-black/5 overflow-hidden">
         <div className="flex space-x-2 justify-center items-center h-screen">
            <span className="sr-only">Loading...</span>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce"></div>
         </div>
      </div>
   );
}
