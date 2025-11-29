// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (userId: string): Socket => {
   if (!socket) {
      socket = io(
         process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.105:5000",
         {
            path: "/api/socket.io/",
         }
      );
   }

   if (!socket.connected) {
      socket.connect();
      socket.emit("register", userId);
   }

   return socket;
};

export const getSocket = (): Socket | null => socket;
