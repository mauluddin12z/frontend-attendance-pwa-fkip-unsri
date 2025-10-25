"use client";

import {
   createContext,
   useContext,
   useEffect,
   useState,
   ReactNode,
} from "react";
import { useAuth } from "./AuthContext"; // your existing AuthProvider hook
import { initSocket } from "@/utils/socket";

interface Notification {
   message: string;
   timestamp: string;
}
interface NotificationContextType {
   notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
   undefined
);

interface Props {
   children: ReactNode;
}

export const NotificationProvider = ({ children }: Props) => {
   const { user } = useAuth();
   const [notifications, setNotifications] = useState<Notification[]>([]);

   useEffect(() => {
      if (!user?.id) return;

      const socket = initSocket(user.id.toString());

      socket.on("notification", (data: Notification) => {
         setNotifications((prev) => [data, ...prev]);
      });

      return () => {
         socket.off("notification");
      };
   }, [user?.id]);

   return (
      <NotificationContext.Provider value={{ notifications }}>
         {children}
      </NotificationContext.Provider>
   );
};

export const useNotifications = (): NotificationContextType => {
   const context = useContext(NotificationContext);
   if (!context)
      throw new Error(
         "useNotifications must be used within NotificationProvider"
      );
   return context;
};
