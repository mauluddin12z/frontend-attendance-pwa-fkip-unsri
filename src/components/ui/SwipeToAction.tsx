"use client";

import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, useEffect } from "react";

interface SwipeToActionProps {
   onAction: () => void;
   type: "checkin" | "checkout";
   isActive?: boolean;
   isLoading?: boolean;
}

export default function SwipeToAction({
   onAction,
   type,
   isActive = true,
   isLoading = false,
}: SwipeToActionProps) {
   const sliderRef = useRef<HTMLDivElement>(null);
   const [dragX, setDragX] = useState(0);
   const [dragging, setDragging] = useState(false);
   const [shouldAnimate, setShouldAnimate] = useState(false); // Controls knob transition

   const actionText =
      type === "checkin" ? "Swipe to Check-in" : "Swipe to Check-out";
   const actionTextColor =
      type === "checkin" ? "text-blue-400" : "text-red-400";

   const disabled = !isActive || isLoading;

   const handleStart = () => {
      if (disabled) return;
      setDragging(true);
      setShouldAnimate(false); // Disable transition during drag
   };

   const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled || !dragging) return;

      let clientX = 0;
      if ("touches" in e) {
         clientX = e.touches[0].clientX;
      } else {
         clientX = e.clientX;
      }

      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      let pos = clientX - rect.left;

      pos = Math.max(0, Math.min(pos, rect.width)); // Clamp
      setDragX(pos);
   };

   const handleEnd = () => {
      if (disabled || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const shouldTrigger = dragX > rect.width * 0.8;

      setShouldAnimate(true); // Enable transition when snapping back

      if (shouldTrigger) {
         onAction();
      }

      setDragX(0);
      setDragging(false);
   };

   // Trail color gradient depending on type
   const trailGradient =
      type === "checkin"
         ? "bg-gradient-to-r from-blue-300 to-blue-200"
         : "bg-gradient-to-r from-red-300 to-red-200";

   return (
      <div
         ref={sliderRef}
         className={`relative w-full h-12 rounded-lg shadow-lg overflow-hidden select-none transition-opacity duration-200 bg-${
            type === "checkin" ? "blue-400" : "red-400"
         } ${disabled ? "cursor-not-allowed brightness-[180%]" : ""}`}
         onTouchStart={handleStart}
         onTouchMove={handleMove}
         onTouchEnd={handleEnd}
         onMouseDown={handleStart}
         onMouseMove={(e) => dragging && handleMove(e)}
         onMouseUp={handleEnd}
         onMouseLeave={() => dragging && handleEnd()}
      >
         {/* Animated Gradient Trail */}
         <div
            className={`${trailGradient} absolute top-0 left-0 h-full pointer-events-none`}
            style={{
               width: `${dragX}px`,
               transition: shouldAnimate ? "width 0.3s ease" : "none",
            }}
         ></div>

         {/* Background Text */}
         <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none select-none">
            {isLoading ? "Processing..." : actionText}
         </div>

         {/* Slider Knob */}
         <div className="absolute top-0 left-0 h-full p-1.5">
            <div
               className={`h-full aspect-square bg-white rounded-lg shadow-md flex items-center justify-center font-bold ${
                  shouldAnimate ? "transition-transform duration-200" : ""
               } ${actionTextColor}`}
               style={{
                  transform: `translateX(${dragX}px)`,
                  pointerEvents: disabled ? "none" : "auto",
               }}
            >
               {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
               ) : (
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
               )}
            </div>
         </div>
      </div>
   );
}
