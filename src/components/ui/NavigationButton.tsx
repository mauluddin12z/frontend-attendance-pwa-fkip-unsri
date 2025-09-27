import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Reusable NavigationButton component
const NavigationButton = ({
   direction,
   onClick,
}: {
   direction: "prev" | "next";
   onClick: () => void;
}) => {
   return (
      <button
         onClick={onClick}
         className="p-2 bg-gray-200 rounded-lg text-gray-600"
      >
         <FontAwesomeIcon
            icon={direction === "prev" ? faAngleLeft : faAngleRight}
            size="lg"
         />
      </button>
   );
};

export default NavigationButton;
