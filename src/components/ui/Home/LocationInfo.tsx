"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "@/context/LocationContext";
import { SettingsGeofence } from "@/types";
import { haversine } from "@/utils/heversine";
import React, { useEffect, useState } from "react";

interface LocationInfoProps {
   settingsGeofences: SettingsGeofence[] | undefined;
   isLoading: boolean;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
   settingsGeofences,
   isLoading,
}) => {
   const {
      userLocation,
      requestLocation,
      locationError,
      isLoading: locationLoading,
   } = useLocation();

   const [closestDistance, setClosestDistance] = useState<number | null>(null);
   const [closestName, setClosestName] = useState<string | null>(null);
   const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(false);

   useEffect(() => {
      if (!userLocation || !settingsGeofences?.length) {
         setClosestDistance(null);
         setClosestName(null);
         setIsInsideGeofence(false);
         return;
      }

      const activeGeofences = settingsGeofences.filter((g) => g.isActive);
      if (!activeGeofences.length) return;

      const distances = activeGeofences.map((geofence) => ({
         name: geofence.name,
         distance: haversine(
            userLocation.lat,
            userLocation.lng,
            geofence.latitude,
            geofence.longitude
         ),
         radius: geofence.radiusMeters,
      }));

      if (!distances.length) return;

      const closest = distances.reduce(
         (prev, curr) => (curr.distance < prev.distance ? curr : prev),
         distances[0]
      );

      setClosestDistance(closest.distance);
      setClosestName(closest.name);
      setIsInsideGeofence(closest.distance <= closest.radius);
   }, [userLocation, settingsGeofences]);

   const handleClick = () => {
      if (!userLocation || locationError) {
         const confirmRetry = window.confirm(
            "Lokasi tidak tersedia. Aktifkan GPS dan beri izin. Coba lagi?"
         );
         if (confirmRetry) requestLocation();
      } else {
         requestLocation();
      }
   };

   return (
      <div className="flex space-x-4 w-[80%]">
         <button
            onClick={handleClick}
            className="p-2 w-10 h-10 bg-blue-300 rounded-lg transition hover:bg-blue-500 text-white flex items-center justify-center"
            title="Dapatkan lokasi saat ini"
         >
            <FontAwesomeIcon icon={faLocationDot} size="lg" />
         </button>

         {isLoading || locationLoading ? (
            <div className="text-white font-light text-sm break-words">
               Memuat lokasi...
            </div>
         ) : (
            <div className="flex flex-col">
               <span className="text-white font-light text-sm">Lokasi</span>
               <p className="text-white font-medium text-sm">
                  {closestDistance !== null && closestName
                     ? isInsideGeofence
                        ? `Anda berada di dalam area ${closestName}!`
                        : `Anda berjarak ${closestDistance.toFixed(
                             2
                          )} km dari ${closestName}`
                     : locationError || "---"}
               </p>
            </div>
         )}
      </div>
   );
};

export default LocationInfo;
