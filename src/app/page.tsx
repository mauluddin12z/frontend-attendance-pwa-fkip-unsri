"use client";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
   const notify = () =>
      toast(
         <div className="flex items-center">
            <div className="p-1 aspect-square rounded-full mr-4 bg-yellow-400">
               <FontAwesomeIcon className="text-white" icon={faBell} />
            </div>
            Hello World!
         </div>
      );

   return (
      <div>
         <button onClick={notify}>Show Toast</button>
         {/* This renders the toast notifications */}
         <Toaster />
      </div>
   );
}
