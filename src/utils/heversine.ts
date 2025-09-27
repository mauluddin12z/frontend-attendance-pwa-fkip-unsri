export function haversine(
   lat1: number,
   lon1: number,
   lat2: number,
   lon2: number
): number {
   const R = 6371; // Earth radius in kilometers

   // Convert degrees to radians
   const toRadians = (degree: number): number => degree * (Math.PI / 180);

   const phi1 = toRadians(lat1);
   const phi2 = toRadians(lat2);
   const deltaPhi = toRadians(lat2 - lat1);
   const deltaLambda = toRadians(lon2 - lon1);

   // Haversine formula
   const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   const distance = R * c; // Distance in kilometers
   return distance;
}

