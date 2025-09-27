import { haversine } from "@/utils/heversine";
import React from "react";

export default function page() {
   // Example usage:
   const distance = haversine(
      -2.9581962225474805,
      104.75689349,
      -2.957524370397373,
      104.75409285702968
   );
   return <div>{`Distance: ${distance.toFixed(2)} km`}</div>;
}
