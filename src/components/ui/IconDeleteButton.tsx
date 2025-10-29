import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function IconDeleteButton({
   action,
   isAction,
}: {
   action: () => void;
   isAction: boolean;
}) {
   return (
      <button
         onClick={action}
         disabled={isAction}
         className={`flex justify-center items-center text-sm p-2 rounded border
                  ${
                     isAction
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-red-500 border-red-600 underline hover:bg-red-200 focus:bg-red-200"
                  }`}
      >
         <FontAwesomeIcon icon={faTrash} />
      </button>
   );
}
