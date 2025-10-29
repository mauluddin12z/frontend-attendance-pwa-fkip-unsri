// app/layout.tsx
import { AuthProvider } from "@/context/AuthContext";
import { DeviceProvider } from "@/context/DeviceContext";
import { LocationProvider } from "@/context/LocationContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "react-hot-toast";
import { Poppins } from "next/font/google";
import "./globals.css";
import NotificationToast from "@/components/ui/Notification/NotificationToast";
import { Metadata } from "next";

const poppins = Poppins({
   variable: "--font-poppins",
   subsets: ["latin"],
   weight: ["300", "400", "500", "600", "700", "800", "900"],
   display: "swap",
});

export const metadata: Metadata = {
   title: "Absensi FKIP UNSRI",
   description: "Absensi FKIP UNSRI",
   generator: "Next.js",
   icons: [
      { rel: "apple-touch-icon", url: "/icons/icon-128x128.png" },
      { rel: "icon", url: "/icons/icon-128x128.png" },
   ],
};

export const viewport = {
   content:
      "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
   themeColor: [
      { media: "(prefers-color-scheme: dark)", color: "#000" },
      { media: "(prefers-color-scheme: light)", color: "#000" },
   ],
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <head>
            <link rel="manifest" href="/manifest.json" />
         </head>
         <body className={`${poppins.variable} antialiased`}>
            <AuthProvider>
               <NotificationProvider>
                  <DeviceProvider>
                     <LocationProvider>
                        <NotificationToast />
                        <Toaster position="top-center" reverseOrder={false} />
                        {children}
                     </LocationProvider>
                  </DeviceProvider>
               </NotificationProvider>
            </AuthProvider>
         </body>
      </html>
   );
}
