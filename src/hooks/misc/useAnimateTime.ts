import { useEffect, useState } from "react";

const generateRandomTime = (): string => {
   const randomDigit = () => Math.floor(Math.random() * 10).toString();

   const h1 = randomDigit();
   const h2 = randomDigit();
   const m1 = randomDigit();
   const m2 = randomDigit();
   const s1 = randomDigit();
   const s2 = randomDigit();

   return `${h1}${h2}:${m1}${m2}:${s1}${s2}`;
};

export function useAnimatedTime(isAnimating: boolean, time: string) {
   const [animatedTime, setAnimatedTime] = useState("00:00:00");

   useEffect(() => {
      let interval: NodeJS.Timeout;

      if (isAnimating) {
         interval = setInterval(() => {
            setAnimatedTime(generateRandomTime());
         }, 50);
      } else {
         setAnimatedTime(time);
      }

      return () => clearInterval(interval);
   }, [isAnimating, time]);

   return animatedTime;
}
