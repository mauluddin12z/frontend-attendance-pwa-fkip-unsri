export function getGeolocation(): Promise<GeolocationPosition> {
   return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
         reject(new Error("Geolocation is not supported by your browser."));
         return;
      }

      navigator.geolocation.getCurrentPosition(
         resolve,
         (error) => {
            switch (error.code) {
               case error.PERMISSION_DENIED:
                  reject(
                     new Error("Permission to access location was denied.")
                  );
                  break;
               case error.POSITION_UNAVAILABLE:
                  reject(new Error("Location information is unavailable."));
                  break;
               case error.TIMEOUT:
                  reject(
                     new Error("The request to get your location timed out.")
                  );
                  break;
               default:
                  reject(
                     new Error(
                        "An unknown error occurred while retrieving location."
                     )
                  );
                  break;
            }
         },
         { enableHighAccuracy: true, timeout: 10000 }
      );
   });
}
