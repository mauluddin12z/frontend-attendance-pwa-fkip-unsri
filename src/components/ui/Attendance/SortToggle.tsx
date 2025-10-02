import AscendingIcon from "@/assets/AscendingIcon.svg";
import DescendingIcon from "@/assets/DescendingIcon.svg";

interface SortToggleProps {
   sortOrder: "asc" | "desc";
   setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}

const SortToggle: React.FC<SortToggleProps> = ({ sortOrder, setSortOrder }) => {
   // Toggle function to switch between "asc" and "desc"
   const toggleSortOrder = () => {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
   };

   return (
      <button
         onClick={toggleSortOrder}
         className="p-2 rounded-lg border border-gray-300 hover:bg-gray-200 flex items-center justify-center"
         aria-label={`Toggle sort order, currently ${
            sortOrder === "asc" ? "ascending" : "descending"
         }`}
         type="button"
      >
         <div className="w-5 h-5">
            {sortOrder === "asc" ? <AscendingIcon /> : <DescendingIcon />}
         </div>
      </button>
   );
};

export default SortToggle;
