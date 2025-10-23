import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { DeviceProvider } from "@/context/DeviceContext";
import { LocationProvider } from "@/context/LocationContext";
// Load the Poppins font
const poppins = Poppins({
   variable: "--font-poppins",
   subsets: ["latin"],
   weight: ["300", "400", "500", "600", "700", "800", "900"],
   display: "swap",
});

export const metadata: Metadata = {
   title: "Sistem Absensi FKIP Unsri",
   description: "Sistem Absensi FKIP Unsri",
   manifest: "/manifest.json",
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
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${poppins.variable} antialiased`}>
            <AuthProvider>
               <DeviceProvider>
                  <LocationProvider>
                     <Toaster position="top-center" reverseOrder={false} />
                     {children}
                  </LocationProvider>
               </DeviceProvider>
            </AuthProvider>
         </body>
      </html>
   );
}
