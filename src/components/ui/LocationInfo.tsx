import { SettingsGeofence, UserLocation } from "@/types";
import { haversine } from "@/utils/heversine";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

interface LocationInfoProps {
   settingsGeofences: SettingsGeofence[] | undefined;
   isLoading: boolean;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
   settingsGeofences,
   isLoading,
}) => {
   const [userLocation, setUserLocation] = useState<UserLocation | null>();
   const [closestDistance, setClosestDistance] = useState<number | null>(null);
   const [closestName, setClosestName] = useState<string | null>(null);
   const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(false);

   // Function to request current location
   const requestLocation = () => {
      if (!navigator.geolocation) {
         alert("Geolocation is not supported by your browser.");
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
               "Unable to retrieve location. Please enable GPS/location services and grant permission."
            );
            setClosestDistance(null);
            setClosestName(null);
         }
      );
   };

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
         radius: geofence.radiusMeters, // Get radius from geofence data
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
            "Location is unavailable. Please enable GPS/location services and grant permission. Try again?"
         );
         if (enableGPS) {
            requestLocation();
         }
      } else {
         // Optional: if location is already known, maybe refresh location on click
         requestLocation();
      }
   };

   return (
      <div className="flex space-x-4 w-[80%]">
         <button
            onClick={handleClick}
            className="p-2 w-10 h-10 bg-blue-300 text-white rounded-lg flex items-center justify-center"
            title="Get current location"
         >
            <FontAwesomeIcon icon={faLocationDot} size="lg" />
         </button>

         {isLoading ? (
            <div className="text-white font-light text-sm break-words">
               Loading...
            </div>
         ) : (
            <div className="flex flex-col">
               <span className="text-white font-light text-sm">Distance</span>
               <p className="text-white font-medium text-sm">
                  {closestDistance !== null && closestName
                     ? isInsideGeofence
                        ? `You are inside the ${closestName} area!`
                        : `You are ${closestDistance.toFixed(
                             2
                          )} km away from ${closestName}`
                     : "---"}
               </p>
            </div>
         )}
      </div>
   );
};

export default LocationInfo;
