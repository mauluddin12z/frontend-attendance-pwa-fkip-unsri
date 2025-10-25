import React from "react";

export default function BounceLoading() {
   return (
      <div className="flex space-x-2 justify-center items-center">
         <span className="sr-only">Loading...</span>
         <div className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
         <div className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
         <div className="h-2.5 w-2.5 bg-blue-400 rounded-full animate-bounce"></div>
      </div>
   );
}
