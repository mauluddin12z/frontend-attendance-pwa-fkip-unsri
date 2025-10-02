import GridIcon from "@/assets/GridIcon.svg";
import ListIcon from "@/assets/ListIcon.svg";

type ViewType = "list" | "grid";

interface AttendanceViewTypeToggleProps {
   viewType: ViewType;
   setViewType: React.Dispatch<React.SetStateAction<ViewType>>;
}

const viewOptions: {
   type: ViewType;
   Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
   { type: "list", Icon: ListIcon },
   { type: "grid", Icon: GridIcon },
];

const AttendanceViewTypeToggle: React.FC<AttendanceViewTypeToggleProps> = ({
   viewType,
   setViewType,
}) => {
   return (
      <div className="flex gap-2 justify-center">
         {viewOptions.map(({ type, Icon }) => {
            const isActive = viewType === type;
            return (
               <button
                  key={type}
                  onClick={() => setViewType(type)}
                  disabled={isActive}
                  className={`p-2 rounded-lg hover:bg-gray-200 border border-gray-300 ${
                     isActive
                        ? "bg-gray-200 text-white cursor-not-allowed"
                        : "bg-white"
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
