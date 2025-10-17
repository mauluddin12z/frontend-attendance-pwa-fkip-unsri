import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Search from "./Search";

export default function AdminTableToolbar({
   searchQuery,
   setSearchQuery,
   openModalFilter,
   openModalAdd,
   columnVisibility = {},
}: Readonly<{
   searchQuery?: string;
   setSearchQuery?: (value: string) => void;
   openModalFilter: () => void;
   openModalAdd: () => void;
   columnVisibility?: {
      search?: boolean;
      filter?: boolean;
      add?: boolean;
   };
}>) {
   // Default column visibility configuration
   const defaultVisibility = {
      search: true,
      filter: true,
      add: true,
   };

   // Merge default visibility with the passed prop to control visibility
   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };
   return (
      <div className="flex flex-wrap w-full justify-between gap-2 p-2">
         {(finalColumnVisibility.search || finalColumnVisibility.filter) && (
            <div className="flex items-center space-x-2">
               {finalColumnVisibility.search && setSearchQuery && (
                  <Search
                     searchQuery={searchQuery!}
                     setSearchQuery={setSearchQuery}
                  />
               )}

               {finalColumnVisibility.filter && (
                  <button
                     onClick={openModalFilter}
                     className="flex flex-nowrap bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-black h-fit px-3 py-2 rounded-lg cursor-pointer"
                  >
                     <FontAwesomeIcon className="mr-2" icon={faFilter} />
                     Filter
                  </button>
               )}
            </div>
         )}
         {finalColumnVisibility.add && (
            <button
               onClick={openModalAdd}
               className="flex justify-center items-center py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer text-white bg-green-600 hover:bg-green-700"
            >
               Tambah
            </button>
         )}
      </div>
   );
}
