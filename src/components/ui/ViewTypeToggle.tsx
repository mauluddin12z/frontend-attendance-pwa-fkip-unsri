import GridIcon from "@/assets/GridIcon.svg";
import ListIcon from "@/assets/ListIcon.svg";

interface AttendanceViewTypeToggleProps {
   viewType: "list" | "grid";
   setViewType: React.Dispatch<React.SetStateAction<"list" | "grid">>;
}

const viewOptions = [
   { type: "list", Icon: ListIcon },
   { type: "grid", Icon: GridIcon },
];

const AttendanceViewTypeToggle: React.FC<AttendanceViewTypeToggleProps> = ({
   viewType,
   setViewType,
}) => {
   const toggleViewType = () => {
      setViewType(viewType === "list" ? "grid" : "list");
   };
   return (
      <div className="flex gap-2 justify-center">
         {viewOptions.map(({ type, Icon }) => {
            const isActive = viewType === type;
            return (
               <button
                  key={type}
                  onClick={() => toggleViewType()}
                  className={`p-2 rounded-lg hover:bg-gray-200 border border-gray-300 ${
                     isActive ? "bg-gray-200 text-white" : "bg-white"
                  }`}
               >
                  <div className="w-5 h-5">
                     <Icon />
                  </div>
               </button>
            );
         })}
      </div>
   );
};

export default AttendanceViewTypeToggle;
