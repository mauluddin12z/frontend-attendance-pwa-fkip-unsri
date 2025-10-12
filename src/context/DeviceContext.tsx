"use client";

import React, {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useState,
   useMemo,
} from "react";
import { isMobile } from "react-device-detect";

interface DeviceContextProps {
   isMobileDevice: boolean | null;
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

   const contextValue = useMemo(() => ({ isMobileDevice }), [isMobileDevice]);

   return (
      <DeviceContext.Provider value={contextValue}>
         {children}
      </DeviceContext.Provider>
   );
};

export const useDevice = (): DeviceContextProps => useContext(DeviceContext);
