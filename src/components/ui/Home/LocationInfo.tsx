import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { SettingsGeofence, UserLocation } from "@/types";
import { haversine } from "@/utils/heversine";

interface LocationInfoProps {
   settingsGeofences: SettingsGeofence[] | undefined;
   isLoading: boolean;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
   settingsGeofences,
   isLoading,
}) => {
   const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
   const [closestDistance, setClosestDistance] = useState<number | null>(null);
   const [closestName, setClosestName] = useState<string | null>(null);
   const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(false);

   // Function to request current location
   const requestLocation = () => {
      if (!navigator.geolocation) {
         alert("Geolocation tidak support pada browser anda.");
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (pos) => {
            setUserLocation({
               lat: pos.coords.latitude,
               lng: pos.coords.longitude,
            });
         },
         (err) => {
            alert(
               "Tidak dapat mengambil lokasi. Harap aktifkan GPS/layanan lokasi dan beri izin."
            );
            setClosestDistance(null);
            setClosestName(null);
         }
      );
   };

   // Automatically fetch location on component mount
   useEffect(() => {
      requestLocation();
   }, []);

   useEffect(() => {
      if (!userLocation || !settingsGeofences?.length) {
         setClosestDistance(null);
         setClosestName(null);
         setIsInsideGeofence(false);
         return;
      }

      const activeGeofences = settingsGeofences.filter((g) => g.isActive);

      if (activeGeofences.length === 0) {
         setClosestDistance(null);
         setClosestName(null);
         setIsInsideGeofence(false);
         return;
      }

      const distancesWithName = activeGeofences.map((geofence) => ({
         name: geofence.name,
         distance: haversine(
            userLocation.lat,
            userLocation.lng,
            geofence.latitude,
            geofence.longitude
         ),
         radius: geofence.radiusMeters,
      }));

      const closest = distancesWithName.reduce((prev, curr) =>
         curr.distance < prev.distance ? curr : prev
      );

      setClosestDistance(closest.distance);
      setClosestName(closest.name);

      // Check if user is inside the geofence
      if (closest.distance <= closest.radius) {
         setIsInsideGeofence(true);
      } else {
         setIsInsideGeofence(false);
      }
   }, [userLocation, settingsGeofences]);

   const handleClick = () => {
      // If location unavailable, ask user to activate GPS
      if (closestDistance === null || closestName === null) {
         const enableGPS = window.confirm(
            "Lokasi tidak tersedia. Harap aktifkan GPS/layanan lokasi dan beri izin. Coba lagi?"
         );
         if (enableGPS) {
            requestLocation();
         }
      } else {
         requestLocation();
      }
   };

   return (
      <div className="flex space-x-4 w-[80%]">
         <button
            onClick={handleClick}
            className="p-2 w-10 h-10 bg-blue-300 text-white rounded-lg flex items-center justify-center"
            title="Dapatkan lokasi saat ini"
         >
            <FontAwesomeIcon icon={faLocationDot} size="lg" />
         </button>

         {isLoading ? (
            <div className="text-white font-light text-sm break-words">
               Memuat...
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
                     : "---"}
               </p>
            </div>
         )}
      </div>
   );
};

export default LocationInfo;
