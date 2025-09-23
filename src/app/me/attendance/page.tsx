"use client";

import React, { useState } from "react";

export default function Page() {
   const [userLocation, setUserLocation] = useState<{
      latitude: number;
      longitude: number;
   } | null>(null);

   const [loading, setLoading] = useState<boolean>(false); // To handle loading state
   const [error, setError] = useState<string | null>(null); // To handle error message

   const getUserLocation = () => {
      setLoading(true);
      setError(null); // Reset error on new request
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const { latitude, longitude } = position.coords;
               setUserLocation({ latitude, longitude });
               setLoading(false); // Stop loading
            },
            (error) => {
               console.error("Error getting user location: ", error);
               setError("Failed to get your location. Please try again.");
               setLoading(false); // Stop loading
            }
         );
      } else {
         setError("Geolocation is not supported by this browser.");
         setLoading(false); // Stop loading
      }
   };

   return (
      <>
         <h1>Geolocation App</h1>
         <button onClick={getUserLocation} disabled={loading}>
            {loading ? "Getting Location..." : "Get User Location"}
         </button>
         {error && <p style={{ color: "red" }}>{error}</p>}{" "}
         {/* Display error message */}
         {userLocation && (
            <div>
               <h2>User Location</h2>
               <p>Latitude: {userLocation.latitude}</p>
               <p>Longitude: {userLocation.longitude}</p>
            </div>
         )}
      </>
   );
}
