// app/layout.tsx
import { AuthProvider } from "@/context/AuthContext";
import { DeviceProvider } from "@/context/DeviceContext";
import { LocationProvider } from "@/context/LocationContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "react-hot-toast";
import Roboto from "next/font/local";
import "./globals.css";
import NotificationToast from "@/components/ui/Notification/NotificationToast";
import { Metadata } from "next";

const roboto = Roboto({
  src: [
    { path: "./fonts/Roboto/Roboto-Thin.ttf", weight: "100", style: "normal" },
    {
      path: "./fonts/Roboto/Roboto-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/Roboto/Roboto-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    { path: "./fonts/Roboto/Roboto-Light.ttf", weight: "300", style: "normal" },
    {
      path: "./fonts/Roboto/Roboto-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/Roboto/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Roboto/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/Roboto/Roboto-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    { path: "./fonts/Roboto/Roboto-Bold.ttf", weight: "700", style: "normal" },
    {
      path: "./fonts/Roboto/Roboto-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/Roboto/Roboto-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    { path: "./fonts/Roboto/Roboto-Black.ttf", weight: "900", style: "normal" },
    {
      path: "./fonts/Roboto/Roboto-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
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
      <body className={`${roboto.variable} antialiased`}>
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
