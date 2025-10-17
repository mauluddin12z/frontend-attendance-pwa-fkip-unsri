import { Location } from "@/types";
import LoadingSpinner from "../Loading/LoadingSpinner";

interface LocationTableProps {
   locations: Location[];
   locationLoading: boolean;
   openModal: (location: Location, action: "edit" | "delete") => void;
   columnVisibility?: {
      id?: boolean;
      name?: boolean;
      latitude?: boolean;
      longitude?: boolean;
      radiusMeters?: boolean;
      isActive?: boolean;
      action?: boolean;
   };
}

const LocationTable = ({
   locations,
   locationLoading,
   openModal,
   columnVisibility = {},
}: LocationTableProps) => {
   const defaultVisibility = {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      radiusMeters: true,
      isActive: true,
      action: true,
   };

   const finalColumnVisibility = { ...defaultVisibility, ...columnVisibility };

   return (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
         <thead className="text-xs text-gray-700 bg-gray-50 font-semibold">
            <tr>
               {finalColumnVisibility.id && <th className="px-6 py-3">ID</th>}
               {finalColumnVisibility.name && (
                  <th className="px-6 py-3">Nama</th>
               )}
               {finalColumnVisibility.latitude && (
                  <th className="px-6 py-3">Latitude</th>
               )}
               {finalColumnVisibility.longitude && (
                  <th className="px-6 py-3">Longitude</th>
               )}
               {finalColumnVisibility.radiusMeters && (
                  <th className="px-6 py-3">Radius (m)</th>
               )}
               {finalColumnVisibility.isActive && (
                  <th className="px-6 py-3">Aktif</th>
               )}
               {finalColumnVisibility.action && (
                  <th className="px-6 py-3 text-center">Aksi</th>
               )}
            </tr>
         </thead>
         <tbody>
            {locationLoading ? (
               <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                     <LoadingSpinner />
                  </td>
               </tr>
            ) : !locations || locations.length === 0 ? (
               <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                     Tidak ada data lokasi
                  </td>
               </tr>
            ) : (
               locations.map((location: Location) => (
                  <tr
                     key={location.id}
                     className="bg-white border-b border-gray-200"
                  >
                     {finalColumnVisibility.id && (
                        <td className="px-6 py-4">{location.id}</td>
                     )}
                     {finalColumnVisibility.name && (
                        <td className="px-6 py-4">{location.name}</td>
                     )}
                     {finalColumnVisibility.latitude && (
                        <td className="px-6 py-4">{location.latitude}</td>
                     )}
                     {finalColumnVisibility.longitude && (
                        <td className="px-6 py-4">{location.longitude}</td>
                     )}
                     {finalColumnVisibility.radiusMeters && (
                        <td className="px-6 py-4">{location.radiusMeters}</td>
                     )}
                     {finalColumnVisibility.isActive && (
                        <td className="px-6 py-4">
                           {location.isActive ? "Ya" : "Tidak"}
                        </td>
                     )}
                     <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                           <button
                              onClick={() => openModal(location, "edit")}
                              className="font-medium text-blue-600 hover:underline cursor-pointer"
                           >
                              Edit
                           </button>
                           <button
                              onClick={() => openModal(location, "delete")}
                              className="font-medium text-red-600 hover:underline cursor-pointer"
                           >
                              Delete
                           </button>
                        </div>
                     </td>
                  </tr>
               ))
            )}
         </tbody>
      </table>
   );
};

export default LocationTable;
