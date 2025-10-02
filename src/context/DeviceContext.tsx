"use client";

import React, {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useState,
} from "react";
import { isMobile } from "react-device-detect";

interface DeviceContextProps {
   isMobileDevice: boolean | null; // null means "not detected yet"
}

const DeviceContext = createContext<DeviceContextProps>({
   isMobileDevice: null,
});

interface DeviceProviderProps {
   children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
   const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

   useEffect(() => {
      setIsMobileDevice(isMobile);
   }, []);

   return (
      <DeviceContext.Provider value={{ isMobileDevice }}>
         {children}
      </DeviceContext.Provider>
   );
};

export const useDevice = (): DeviceContextProps => useContext(DeviceContext);
