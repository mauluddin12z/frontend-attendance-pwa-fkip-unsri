"use client";

import React, {
   createContext,
   useContext,
   useEffect,
   useState,
   ReactNode,
} from "react";
import { UserLocation } from "@/types";

interface LocationContextType {
   userLocation: UserLocation | null;
   requestLocation: () => void;
   locationError: string | null;
   isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(
   undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
   const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
   const [locationError, setLocationError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const requestLocation = () => {
      if (!navigator.geolocation) {
         setLocationError("Geolocation tidak didukung oleh browser Anda.");
         return;
      }

      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
         (position) => {
            setUserLocation({
               lat: position.coords.latitude,
               lng: position.coords.longitude,
            });
            setLocationError(null);
            setIsLoading(false);
         },
         (error) => {
            setLocationError(
               "Gagal mendapatkan lokasi. Harap aktifkan GPS dan beri izin."
            );
            setUserLocation(null);
            setIsLoading(false);
         }
      );
   };

   // Request on mount (optional)
   useEffect(() => {
      requestLocation();
   }, []);

   return (
      <LocationContext.Provider
         value={{ userLocation, requestLocation, locationError, isLoading }}
      >
         {children}
      </LocationContext.Provider>
   );
};

export const useLocation = () => {
   const context = useContext(LocationContext);
   if (!context) {
      throw new Error("useLocation must be used within a LocationProvider");
   }
   return context;
};
