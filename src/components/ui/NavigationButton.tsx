import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface NavigationButtonProps {
   bgColor?: string;
   borderColor?: string;
   direction: "prev" | "next";
   onClick: () => void;
   className?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
   bgColor = "bg-white",
   borderColor = "border-gray-200",
   direction,
   onClick,
   className = "",
}) => {
   const icon = direction === "prev" ? faArrowLeft : faArrowRight;
   const label = direction === "prev" ? "Previous" : "Next";

   return (
      <button
         type="button"
         onClick={onClick}
         aria-label={label}
         className={`p-2 ${bgColor} border ${borderColor} rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 transition ${className} cursor-pointer`}
      >
         <FontAwesomeIcon icon={icon} size="lg" />
      </button>
   );
};

export default React.memo(NavigationButton);
